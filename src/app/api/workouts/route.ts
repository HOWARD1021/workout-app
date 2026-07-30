import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  getDb,
  workouts,
  workoutLogs,
  exercises,
  workoutTemplates,
  type DbClient,
} from "@/lib/db";
import { eq, isNull, desc, and, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  createSaveRequestContext,
  recordSaveAttempt,
  safeErrorMessage,
  type SaveRequestContext,
  type WorkoutSaveErrorCode,
} from "@/lib/workout-observability";

type WorkoutLogInput = {
  exercise_id: string;
  set_order: number;
  weight: number | null;
  reps: number | null;
  note?: string;
};

type WorkoutBody = {
  id?: string;
  started_at: string;
  ended_at: string;
  template_id?: string;
  note?: string;
  logs?: WorkoutLogInput[];
};

class WorkoutSaveFailure extends Error {
  constructor(
    readonly code: WorkoutSaveErrorCode,
    readonly status: number,
    readonly stage: string
  ) {
    super(code);
  }
}

async function getAuthenticatedUser(request: Request) {
  try {
    return await getCurrentUser(request);
  } catch {
    return null;
  }
}

function responseHeaders(context: SaveRequestContext, error = false) {
  const headers = new Headers({
    "x-request-id": context.requestId,
    "x-workout-release-version": context.releaseVersion,
  });
  if (error) headers.set("x-error-reference", context.errorReference);
  return headers;
}

async function failureResponse({
  context,
  db,
  userId,
  submissionId,
  failure,
  logCount,
}: {
  context: SaveRequestContext;
  db: DbClient | null;
  userId: string | null;
  submissionId: string | null;
  failure: WorkoutSaveFailure;
  logCount?: number;
}) {
  await recordSaveAttempt(db, {
    context,
    userId,
    submissionId,
    status: "error",
    errorCode: failure.code,
    httpStatus: failure.status,
    metadata: {
      failureStage: failure.stage,
      logCount,
    },
  });

  return NextResponse.json(
    {
      error: safeErrorMessage(failure.code),
      code: failure.code,
      errorReference: context.errorReference,
      requestId: context.requestId,
      releaseVersion: context.releaseVersion,
    },
    {
      status: failure.status,
      headers: responseHeaders(context, true),
    }
  );
}

function parseWorkoutBody(value: unknown): WorkoutBody {
  if (!value || typeof value !== "object") {
    throw new WorkoutSaveFailure(
      "INVALID_WORKOUT_PAYLOAD",
      400,
      "validation"
    );
  }

  const body = value as Record<string, unknown>;
  const logs = body.logs;
  const hasValidLogShape = (log: unknown): log is WorkoutLogInput => {
    if (!log || typeof log !== "object") return false;
    const candidate = log as Record<string, unknown>;
    return (
      typeof candidate.exercise_id === "string" &&
      typeof candidate.set_order === "number" &&
      (candidate.weight === null || typeof candidate.weight === "number") &&
      (candidate.reps === null || typeof candidate.reps === "number") &&
      (candidate.note === undefined || typeof candidate.note === "string")
    );
  };
  if (
    typeof body.started_at !== "string" ||
    body.started_at.length === 0 ||
    typeof body.ended_at !== "string" ||
    body.ended_at.length === 0 ||
    (logs !== undefined &&
      (!Array.isArray(logs) || logs.some((log) => !hasValidLogShape(log))))
  ) {
    throw new WorkoutSaveFailure(
      "INVALID_WORKOUT_PAYLOAD",
      400,
      "validation"
    );
  }

  return {
    id: typeof body.id === "string" ? body.id : undefined,
    started_at: body.started_at,
    ended_at: body.ended_at,
    template_id:
      typeof body.template_id === "string" ? body.template_id : undefined,
    note: typeof body.note === "string" ? body.note : undefined,
    logs: (logs || []) as WorkoutLogInput[],
  };
}

async function sanitizeWorkoutLogs(db: DbClient, logs: WorkoutLogInput[]) {
  const uniqueExerciseIds = [
    ...new Set(logs.map((log) => log.exercise_id).filter(Boolean)),
  ];

  if (uniqueExerciseIds.length === 0) {
    return { logs: [] as WorkoutLogInput[], skippedLogs: 0 };
  }

  const existing = await db
    .select({ id: exercises.id })
    .from(exercises)
    .where(
      and(inArray(exercises.id, uniqueExerciseIds), isNull(exercises.deletedAt))
    );

  const validIds = new Set(existing.map((row) => row.id));
  const sanitizedLogs = logs.filter(
    (log) => log.exercise_id && validIds.has(log.exercise_id)
  );

  return {
    logs: sanitizedLogs,
    skippedLogs: logs.length - sanitizedLogs.length,
  };
}

async function resolveTemplateId(db: DbClient, templateId?: string) {
  if (!templateId) return null;

  const [template] = await db
    .select({ id: workoutTemplates.id })
    .from(workoutTemplates)
    .where(
      and(eq(workoutTemplates.id, templateId), isNull(workoutTemplates.deletedAt))
    )
    .limit(1);

  return template?.id ?? null;
}

async function findWorkout(db: DbClient, id: string) {
  const [workout] = await db
    .select()
    .from(workouts)
    .where(eq(workouts.id, id))
    .limit(1);
  return workout;
}

export async function GET(request: Request) {
  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    const result = await db
      .select()
      .from(workouts)
      .where(and(isNull(workouts.deletedAt), eq(workouts.userId, user.id)))
      .orderBy(desc(workouts.startedAt));

    const workoutsWithLogs = await Promise.all(
      result.map(async (workout) => {
        const logs = await db
          .select({
            id: workoutLogs.id,
            weight: workoutLogs.weight,
            reps: workoutLogs.reps,
            exerciseId: workoutLogs.exerciseId,
            exercise: {
              muscleGroup: exercises.muscleGroup,
            },
          })
          .from(workoutLogs)
          .leftJoin(exercises, eq(workoutLogs.exerciseId, exercises.id))
          .where(eq(workoutLogs.workoutId, workout.id));

        return {
          ...workout,
          workout_logs: logs,
        };
      })
    );

    return NextResponse.json(workoutsWithLogs);
  } catch {
    return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  let runtimeVersion: string | undefined;
  try {
    runtimeVersion = getCloudflareContext().env.WORKOUT_APP_VERSION;
  } catch {
    runtimeVersion = undefined;
  }
  const context = createSaveRequestContext(request, runtimeVersion);
  let db: DbClient | null = null;
  let userId: string | null = null;
  let submissionId: string | null = null;
  let logCount: number | undefined;

  try {
    const user = await getAuthenticatedUser(request);
    if (!user) {
      return failureResponse({
        context,
        db,
        userId,
        submissionId,
        failure: new WorkoutSaveFailure("AUTH_REQUIRED", 401, "auth"),
      });
    }
    userId = user.id;

    const { env } = getCloudflareContext();
    db = getDb(env.DB);

    let body: WorkoutBody;
    try {
      body = parseWorkoutBody(await request.json());
    } catch (error) {
      if (error instanceof WorkoutSaveFailure) throw error;
      throw new WorkoutSaveFailure("INVALID_WORKOUT_PAYLOAD", 400, "validation");
    }

    const workoutSubmissionId = body.id?.trim() || crypto.randomUUID();
    submissionId = workoutSubmissionId;
    const existingWorkout = await findWorkout(db, workoutSubmissionId);

    if (existingWorkout) {
      if (existingWorkout.userId !== user.id) {
        throw new WorkoutSaveFailure(
          "SUBMISSION_CONFLICT",
          409,
          "idempotency"
        );
      }

      await recordSaveAttempt(db, {
        context,
        userId,
        submissionId,
        status: "success",
        httpStatus: 200,
        metadata: { deduplicated: true, logCount: 0 },
      });

      return NextResponse.json(
        { ...existingWorkout, skippedLogs: 0, replayed: true },
        { headers: responseHeaders(context) }
      );
    }

    const incomingLogs = body.logs ?? [];
    logCount = incomingLogs.length;
    const { logs, skippedLogs } = await sanitizeWorkoutLogs(db, incomingLogs);

    if (incomingLogs.length > 0 && logs.length === 0) {
      throw new WorkoutSaveFailure("NO_VALID_WORKOUT_LOGS", 400, "validation");
    }

    const templateId = await resolveTemplateId(db, body.template_id);
    const workoutInsert = db.insert(workouts).values({
      id: workoutSubmissionId,
      userId: user.id,
      startedAt: body.started_at,
      endedAt: body.ended_at,
      templateId,
      note: body.note,
    });

    try {
      // D1 does not support Drizzle's explicit BEGIN/COMMIT in a Worker.
      // The workout and its logs remain one D1 batch for atomic persistence.
      if (logs.length > 0) {
        await db.batch([
          workoutInsert,
          db.insert(workoutLogs).values(
            logs.map((log) => ({
              workoutId: workoutSubmissionId,
              exerciseId: log.exercise_id,
              setOrder: log.set_order,
              weight: log.weight,
              reps: log.reps,
              note: log.note || null,
            }))
          ),
        ]);
      } else {
        await db.batch([workoutInsert]);
      }
    } catch {
      // A concurrent duplicate may have won the same submission ID. Resolve
      // it as a replay if the record is now owned by the current user.
      try {
        const racedWorkout = await findWorkout(db, workoutSubmissionId);
        if (racedWorkout?.userId === user.id) {
          await recordSaveAttempt(db, {
            context,
            userId,
            submissionId,
            status: "success",
            httpStatus: 200,
            metadata: { deduplicated: true, logCount },
          });
          return NextResponse.json(
            { ...racedWorkout, skippedLogs: 0, replayed: true },
            { headers: responseHeaders(context) }
          );
        }
      } catch {
        // Fall through to the safe D1 error contract below.
      }
      throw new WorkoutSaveFailure("D1_WRITE_FAILED", 500, "workout_write");
    }

    const workout = await findWorkout(db, workoutSubmissionId);
    if (!workout) {
      throw new WorkoutSaveFailure("D1_WRITE_FAILED", 500, "read_after_write");
    }

    await recordSaveAttempt(db, {
      context,
      userId,
      submissionId,
      status: "success",
      httpStatus: 200,
      metadata: { logCount, skippedLogs },
    });

    return NextResponse.json(
      { ...workout, skippedLogs },
      { headers: responseHeaders(context) }
    );
  } catch (error) {
    const failure =
      error instanceof WorkoutSaveFailure
        ? error
        : new WorkoutSaveFailure("SAVE_FAILED", 500, "unknown");

    return failureResponse({
      context,
      db,
      userId,
      submissionId,
      failure,
      logCount,
    });
  }
}
