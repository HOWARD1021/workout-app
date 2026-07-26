import { getCloudflareContext } from "@opennextjs/cloudflare";
import {
  getDb,
  workouts,
  workoutLogs,
  exercises,
  workoutTemplates,
} from "@/lib/db";
import { eq, isNull, desc, and, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

type WorkoutLogInput = {
  exercise_id: string;
  set_order: number;
  weight: number | null;
  reps: number | null;
  note?: string;
};

async function sanitizeWorkoutLogs(
  db: ReturnType<typeof getDb>,
  logs: WorkoutLogInput[]
) {
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

async function resolveTemplateId(
  db: ReturnType<typeof getDb>,
  templateId?: string
) {
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

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
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

    // Get workout logs for each workout
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
  } catch (error) {
    console.error("Failed to fetch workouts:", error);
    return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const body = await request.json() as {
      id?: string;
      started_at: string;
      ended_at: string;
      template_id?: string;
      note?: string;
      logs?: WorkoutLogInput[];
    };

    const workoutId = body.id?.trim() || undefined;

    if (workoutId) {
      const [existingWorkout] = await db
        .select()
        .from(workouts)
        .where(eq(workouts.id, workoutId))
        .limit(1);

      if (existingWorkout) {
        if (existingWorkout.userId !== user.id) {
          return NextResponse.json(
            { error: "Workout submission conflict" },
            { status: 409 }
          );
        }

        return NextResponse.json({
          ...existingWorkout,
          skippedLogs: 0,
        });
      }
    }

    const incomingLogs = body.logs ?? [];
    const { logs, skippedLogs } = await sanitizeWorkoutLogs(db, incomingLogs);

    if (incomingLogs.length > 0 && logs.length === 0) {
      return NextResponse.json(
        {
          error:
            "找不到已完成的動作資料，請重新整理頁面後再儲存一次。",
        },
        { status: 400 }
      );
    }

    const templateId = await resolveTemplateId(db, body.template_id);

    // Cloudflare D1 does not support Drizzle's explicit BEGIN/COMMIT
    // transaction calls in a Worker. Use D1's batch API instead; batches are
    // executed atomically and work across the production D1 binding.
    const persistedWorkoutId = workoutId || crypto.randomUUID();
    const workoutInsert = db.insert(workouts).values({
      id: persistedWorkoutId,
      userId: user.id,
      startedAt: body.started_at,
      endedAt: body.ended_at,
      templateId,
      note: body.note,
    });

    if (logs.length > 0) {
      await db.batch([
        workoutInsert,
        db.insert(workoutLogs).values(
          logs.map((log) => ({
            workoutId: persistedWorkoutId,
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

    const [workout] = await db
      .select()
      .from(workouts)
      .where(eq(workouts.id, persistedWorkoutId))
      .limit(1);

    if (!workout) {
      throw new Error("Workout was not returned after D1 batch write");
    }

    return NextResponse.json({
      ...workout,
      skippedLogs,
    });
  } catch (error) {
    console.error("Failed to create workout:", error);
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 });
  }
}
