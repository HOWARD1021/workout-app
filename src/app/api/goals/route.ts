import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, asc, desc, eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  exercises,
  getDb,
  goalAdjustmentEvents,
  trainingGoals,
  workoutLogs,
  workouts,
  type DbClient,
} from "@/lib/db";
import {
  calculateGoalBaseline,
  getWeekStart,
  type GoalType,
  type GoalWorkoutRow,
} from "@/lib/goal-aggregation";

const GOAL_TYPES = new Set<GoalType>(["strength", "frequency", "volume"]);

type GoalBody = {
  id?: string;
  type?: GoalType;
  name?: string | null;
  exerciseId?: string | null;
  target?: number;
  windowWeeks?: number;
  action?: "archive" | "replace";
  newExerciseId?: string;
};

function jsonError(error: string, status: number, code?: string) {
  return NextResponse.json({ error, ...(code ? { code } : {}) }, { status });
}

async function getUser(request: Request) {
  try {
    return await getCurrentUser(request);
  } catch {
    return null;
  }
}

function nowIso() {
  return new Date().toISOString();
}

function parseBody(value: unknown): GoalBody | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  return {
    id: typeof body.id === "string" ? body.id : undefined,
    type: typeof body.type === "string" ? (body.type as GoalType) : undefined,
    name: body.name === null || typeof body.name === "string" ? body.name : undefined,
    exerciseId:
      body.exerciseId === null || typeof body.exerciseId === "string"
        ? body.exerciseId
        : body.exercise_id === null || typeof body.exercise_id === "string"
          ? body.exercise_id
          : undefined,
    target:
      typeof body.target === "number"
        ? body.target
        : typeof body.target_value === "number"
          ? body.target_value
          : undefined,
    windowWeeks:
      typeof body.windowWeeks === "number"
        ? body.windowWeeks
        : typeof body.window_weeks === "number"
          ? body.window_weeks
          : undefined,
    action: body.action === "archive" || body.action === "replace" ? body.action : undefined,
    newExerciseId:
      typeof body.newExerciseId === "string"
        ? body.newExerciseId
        : typeof body.new_exercise_id === "string"
          ? body.new_exercise_id
          : undefined,
  };
}

function isValidTarget(value: number | undefined) {
  return typeof value === "number" && Number.isFinite(value) && value > 0;
}

function isValidWindow(value: number | undefined) {
  return typeof value === "number" && Number.isInteger(value) && value >= 1 && value <= 52;
}

function toGoalResponse(goal: typeof trainingGoals.$inferSelect) {
  return {
    id: goal.id,
    userId: goal.userId,
    type: goal.type,
    name: goal.name,
    exerciseId: goal.exerciseId,
    baseline: goal.baseline,
    target: goal.target,
    windowWeeks: goal.windowWeeks,
    startsAt: goal.startsAt,
    endsAt: goal.endsAt,
    status: goal.status,
    createdAt: goal.createdAt,
    updatedAt: goal.updatedAt,
    archivedAt: goal.archivedAt,
  };
}

async function getGoalRows(db: DbClient, userId: string): Promise<GoalWorkoutRow[]> {
  const rows = await db
    .select({
      workoutId: workouts.id,
      startedAt: workouts.startedAt,
      endedAt: workouts.endedAt,
      deletedAt: workouts.deletedAt,
      logId: workoutLogs.id,
      exerciseId: workoutLogs.exerciseId,
      exerciseName: exercises.name,
      muscleGroup: exercises.muscleGroup,
      weight: workoutLogs.weight,
      reps: workoutLogs.reps,
      setOrder: workoutLogs.setOrder,
    })
    .from(workouts)
    .leftJoin(workoutLogs, eq(workoutLogs.workoutId, workouts.id))
    .leftJoin(exercises, eq(workoutLogs.exerciseId, exercises.id))
    .where(and(eq(workouts.userId, userId), isNull(workouts.deletedAt)))
    .orderBy(asc(workouts.startedAt));
  return rows;
}

async function getExercise(db: DbClient, exerciseId: string) {
  const [exercise] = await db
    .select({ id: exercises.id })
    .from(exercises)
    .where(and(eq(exercises.id, exerciseId), isNull(exercises.deletedAt)))
    .limit(1);
  return exercise ?? null;
}

function getStartAndEnd(windowWeeks: number) {
  const startsAt = getWeekStart(new Date())!;
  const endDate = new Date(`${startsAt}T00:00:00.000Z`);
  endDate.setUTCDate(endDate.getUTCDate() + windowWeeks * 7);
  return { startsAt, endsAt: endDate.toISOString().slice(0, 10) };
}

function baselineRows(rows: GoalWorkoutRow[], startsAt: string) {
  const start = new Date(`${startsAt}T00:00:00.000Z`).getTime();
  const lookback = new Date(start);
  lookback.setUTCDate(lookback.getUTCDate() - 8 * 7);
  return rows.filter((row) => {
    const timestamp = new Date(row.startedAt).getTime();
    return Number.isFinite(timestamp) && timestamp >= lookback.getTime() && timestamp < start;
  });
}

export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user) return jsonError("Unauthorized", 401, "AUTH_REQUIRED");

  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const rows = await db
      .select()
      .from(trainingGoals)
      .where(eq(trainingGoals.userId, user.id))
      .orderBy(desc(trainingGoals.createdAt));
    const requestedId = new URL(request.url).searchParams.get("id");
    const goals = requestedId ? rows.filter((goal) => goal.id === requestedId) : rows;
    if (requestedId && goals.length === 0) return jsonError("Goal not found", 404, "GOAL_NOT_FOUND");

    const adjustments = await db
      .select()
      .from(goalAdjustmentEvents)
      .where(eq(goalAdjustmentEvents.userId, user.id))
      .orderBy(asc(goalAdjustmentEvents.createdAt));

    return NextResponse.json({
      activeGoal: goals.find((goal) => goal.status === "active")
        ? toGoalResponse(goals.find((goal) => goal.status === "active")!)
        : null,
      goals: goals.map(toGoalResponse),
      adjustments: adjustments.map((event) => ({
        id: event.id,
        goalId: event.goalId,
        kind: event.kind,
        previousTarget: event.previousTarget,
        newTarget: event.newTarget,
        previousWindowWeeks: event.previousWindowWeeks,
        newWindowWeeks: event.newWindowWeeks,
        previousExerciseId: event.previousExerciseId,
        newExerciseId: event.newExerciseId,
        note: event.note,
        createdAt: event.createdAt,
      })),
    });
  } catch {
    return jsonError("Failed to fetch goals", 500, "GOALS_READ_FAILED");
  }
}

export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user) return jsonError("Unauthorized", 401, "AUTH_REQUIRED");

  const body = parseBody(await request.json().catch(() => null));
  if (!body || !body.type || !GOAL_TYPES.has(body.type) || !isValidTarget(body.target)) {
    return jsonError("type and a positive target are required", 400, "INVALID_GOAL_PAYLOAD");
  }
  const windowWeeks = body.windowWeeks ?? 8;
  if (!isValidWindow(windowWeeks)) return jsonError("windowWeeks must be between 1 and 52", 400, "INVALID_GOAL_WINDOW");
  if (body.type === "strength" && !body.exerciseId) {
    return jsonError("Strength goals require an exercise", 400, "EXERCISE_REQUIRED");
  }

  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const [activeGoal] = await db
      .select({ id: trainingGoals.id })
      .from(trainingGoals)
      .where(and(eq(trainingGoals.userId, user.id), eq(trainingGoals.status, "active")))
      .limit(1);
    if (activeGoal) return jsonError("An active goal already exists", 409, "ACTIVE_GOAL_EXISTS");
    if (body.exerciseId && !(await getExercise(db, body.exerciseId))) {
      return jsonError("Exercise not found", 400, "EXERCISE_NOT_FOUND");
    }

    const { startsAt, endsAt } = getStartAndEnd(windowWeeks);
    const rows = baselineRows(await getGoalRows(db, user.id), startsAt);
    const goal = {
      id: crypto.randomUUID(),
      userId: user.id,
      type: body.type,
      name: body.name?.trim() || null,
      exerciseId: body.exerciseId ?? null,
      baseline: calculateGoalBaseline(rows, body.type, body.exerciseId, startsAt),
      target: body.target!,
      windowWeeks,
      startsAt,
      endsAt,
      status: "active" as const,
      createdAt: nowIso(),
      updatedAt: nowIso(),
      archivedAt: null,
    };
    try {
      await db.insert(trainingGoals).values(goal);
    } catch (error) {
      if (error instanceof Error && /training_goals_one_active_per_user|UNIQUE/i.test(error.message)) {
        return jsonError("An active goal already exists", 409, "ACTIVE_GOAL_EXISTS");
      }
      throw error;
    }
    return NextResponse.json(toGoalResponse(goal), { status: 201 });
  } catch {
    return jsonError("Failed to create goal", 500, "GOAL_CREATE_FAILED");
  }
}

export async function PATCH(request: Request) {
  const user = await getUser(request);
  if (!user) return jsonError("Unauthorized", 401, "AUTH_REQUIRED");
  const body = parseBody(await request.json().catch(() => null));
  if (!body?.id) return jsonError("Goal id is required", 400, "GOAL_ID_REQUIRED");

  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const [goal] = await db
      .select()
      .from(trainingGoals)
      .where(and(eq(trainingGoals.id, body.id), eq(trainingGoals.userId, user.id)))
      .limit(1);
    if (!goal) return jsonError("Goal not found", 404, "GOAL_NOT_FOUND");

    if (body.action === "archive") {
      const archivedAt = nowIso();
      await db
        .update(trainingGoals)
        .set({ status: "archived", archivedAt, updatedAt: archivedAt })
        .where(eq(trainingGoals.id, goal.id));
      return NextResponse.json(toGoalResponse({ ...goal, status: "archived", archivedAt, updatedAt: archivedAt }));
    }

    if (body.action === "replace") {
      if (!body.newExerciseId || goal.type !== "strength") {
        return jsonError("Goal replacement requires a new strength exercise", 400, "INVALID_REPLACEMENT");
      }
      if (!(await getExercise(db, body.newExerciseId))) return jsonError("Exercise not found", 400, "EXERCISE_NOT_FOUND");
      const windowWeeks = goal.windowWeeks;
      const { startsAt, endsAt } = getStartAndEnd(windowWeeks);
      const rows = baselineRows(await getGoalRows(db, user.id), startsAt);
      const replacement = {
        id: crypto.randomUUID(),
        userId: user.id,
        type: goal.type,
        name: goal.name,
        exerciseId: body.newExerciseId,
        baseline: calculateGoalBaseline(rows, goal.type, body.newExerciseId, startsAt),
        target: goal.target,
        windowWeeks,
        startsAt,
        endsAt,
        status: "active" as const,
        createdAt: nowIso(),
        updatedAt: nowIso(),
        archivedAt: null,
      };
      await db
        .update(trainingGoals)
        .set({ status: "replaced", archivedAt: replacement.createdAt, updatedAt: replacement.createdAt })
        .where(eq(trainingGoals.id, goal.id));
      await db.insert(trainingGoals).values(replacement);
      await db.insert(goalAdjustmentEvents).values({
        id: crypto.randomUUID(),
        userId: user.id,
        goalId: goal.id,
        kind: "replacement",
        previousTarget: goal.target,
        newTarget: goal.target,
        previousWindowWeeks: goal.windowWeeks,
        newWindowWeeks: windowWeeks,
        previousExerciseId: goal.exerciseId,
        newExerciseId: body.newExerciseId,
        note: "Goal replaced because its exercise context changed",
        createdAt: replacement.createdAt,
      });
      return NextResponse.json({ previousGoal: toGoalResponse({ ...goal, status: "replaced", archivedAt: replacement.createdAt, updatedAt: replacement.createdAt }), goal: toGoalResponse(replacement) }, { status: 201 });
    }

    if (goal.status !== "active") return jsonError("Only active goals can be adjusted", 409, "GOAL_NOT_ACTIVE");
    if (body.type && body.type !== goal.type) return jsonError("Changing goal type requires a replacement", 409, "GOAL_REPLACEMENT_REQUIRED");
    if (body.exerciseId !== undefined && body.exerciseId !== goal.exerciseId) return jsonError("Changing exercise requires a replacement", 409, "GOAL_REPLACEMENT_REQUIRED");
    if (body.target !== undefined && !isValidTarget(body.target)) return jsonError("target must be positive", 400, "INVALID_GOAL_TARGET");
    if (body.windowWeeks !== undefined && !isValidWindow(body.windowWeeks)) return jsonError("windowWeeks must be between 1 and 52", 400, "INVALID_GOAL_WINDOW");
    const nextTarget = body.target ?? goal.target;
    const nextWindow = body.windowWeeks ?? goal.windowWeeks;
    const startDate = new Date(`${goal.startsAt}T00:00:00.000Z`);
    startDate.setUTCDate(startDate.getUTCDate() + nextWindow * 7);
    const updatedAt = nowIso();
    const updated = { ...goal, name: body.name === undefined ? goal.name : body.name?.trim() || null, target: nextTarget, windowWeeks: nextWindow, endsAt: startDate.toISOString().slice(0, 10), updatedAt };
    await db.update(trainingGoals).set({ name: updated.name, target: nextTarget, windowWeeks: nextWindow, endsAt: updated.endsAt, updatedAt }).where(eq(trainingGoals.id, goal.id));
    if (body.target !== undefined || body.windowWeeks !== undefined) {
      await db.insert(goalAdjustmentEvents).values({
        id: crypto.randomUUID(),
        userId: user.id,
        goalId: goal.id,
        kind: body.target !== undefined && body.windowWeeks !== undefined ? "target" : body.target !== undefined ? "target" : "window",
        previousTarget: goal.target,
        newTarget: nextTarget,
        previousWindowWeeks: goal.windowWeeks,
        newWindowWeeks: nextWindow,
        note: null,
        createdAt: updatedAt,
      });
    }
    return NextResponse.json(toGoalResponse(updated));
  } catch {
    return jsonError("Failed to update goal", 500, "GOAL_UPDATE_FAILED");
  }
}
