import { getCloudflareContext } from "@opennextjs/cloudflare";
import { and, asc, eq, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";
import {
  exercises,
  getDb,
  trainingGoals,
  weeklyGoalSets,
  workoutLogs,
  workouts,
  type DbClient,
} from "@/lib/db";
import {
  calculateActionProgress,
  getWeekStart,
  type GoalAction,
  type GoalWorkoutRow,
} from "@/lib/goal-aggregation";
import { suggestedWeeklyActions, validateWeeklyActions } from "@/lib/weekly-goal-suggestions";

type WeeklyBody = {
  id?: string;
  goalId?: string;
  weekStart?: string;
  status?: "suggested" | "accepted" | "adjusted";
  actions?: GoalAction[];
};

function errorResponse(error: string, status: number, code?: string) {
  return NextResponse.json({ error, ...(code ? { code } : {}) }, { status });
}

async function getUser(request: Request) {
  try {
    return await getCurrentUser(request);
  } catch {
    return null;
  }
}

function parseBody(value: unknown): WeeklyBody | null {
  if (!value || typeof value !== "object") return null;
  const body = value as Record<string, unknown>;
  const rawActions = Array.isArray(body.actions) ? body.actions : Array.isArray(body.items) ? body.items : undefined;
  const actions = rawActions?.map((value) => {
    if (!value || typeof value !== "object") return value as GoalAction;
    const action = value as Record<string, unknown>;
    const id = typeof action.id === "string" ? action.id : typeof action.categoryKey === "string" ? action.categoryKey : typeof action.category_key === "string" ? action.category_key : "";
    const label = typeof action.label === "string" ? action.label : typeof action.labelZh === "string" ? action.labelZh : typeof action.label_zh === "string" ? action.label_zh : "";
    const exerciseId = typeof action.exerciseId === "string" ? action.exerciseId : typeof action.exercise_id === "string" ? action.exercise_id : undefined;
    const muscleGroup = typeof action.muscleGroup === "string" ? action.muscleGroup : typeof action.muscle_group === "string" ? action.muscle_group : undefined;
    const expectedSessions = typeof action.expectedSessions === "number" ? action.expectedSessions : typeof action.expected_sessions === "number" ? action.expected_sessions : 0;
    return { id, label, exerciseId, muscleGroup, expectedSessions } satisfies GoalAction;
  });
  return {
    id: typeof body.id === "string" ? body.id : undefined,
    goalId: typeof body.goalId === "string" ? body.goalId : typeof body.goal_id === "string" ? body.goal_id : undefined,
    weekStart: typeof body.weekStart === "string" ? body.weekStart : typeof body.week_start === "string" ? body.week_start : undefined,
    status:
      body.status === "suggested" || body.status === "accepted" || body.status === "adjusted"
        ? body.status
        : undefined,
    actions,
  };
}

function isCanonicalWeek(value: string) {
  return /^\d{4}-\d{2}-\d{2}$/.test(value) && getWeekStart(`${value}T00:00:00.000Z`) === value;
}

async function getRows(db: DbClient, userId: string): Promise<GoalWorkoutRow[]> {
  return db
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
}

function toResponse(
  set: typeof weeklyGoalSets.$inferSelect,
  progress: ReturnType<typeof calculateActionProgress>
) {
  return {
    id: set.id,
    userId: set.userId,
    goalId: set.goalId,
    weekStart: set.weekStart,
    status: set.status,
    actions: JSON.parse(set.actions) as GoalAction[],
    acceptedAt: set.acceptedAt,
    createdAt: set.createdAt,
    updatedAt: set.updatedAt,
    progress,
  };
}

async function findGoal(db: DbClient, userId: string, goalId?: string, activeOnly = false) {
  const [goal] = await db
    .select()
    .from(trainingGoals)
    .where(
      goalId
        ? activeOnly
          ? and(eq(trainingGoals.id, goalId), eq(trainingGoals.userId, userId), eq(trainingGoals.status, "active"))
          : and(eq(trainingGoals.id, goalId), eq(trainingGoals.userId, userId))
        : and(eq(trainingGoals.userId, userId), eq(trainingGoals.status, "active"))
    )
    .limit(1);
  return goal ?? null;
}

export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user) return errorResponse("Unauthorized", 401, "AUTH_REQUIRED");
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const params = new URL(request.url).searchParams;
    const goal = await findGoal(db, user.id, params.get("goalId") ?? params.get("goal_id") ?? undefined);
    if (!goal) return errorResponse("Active goal not found", 404, "GOAL_NOT_FOUND");
    const weekStart = params.get("weekStart") || params.get("week_start") || getWeekStart(new Date())!;
    if (!isCanonicalWeek(weekStart)) return errorResponse("Invalid weekStart", 400, "INVALID_WEEK");
    const [set] = await db
      .select()
      .from(weeklyGoalSets)
      .where(and(eq(weeklyGoalSets.goalId, goal.id), eq(weeklyGoalSets.userId, user.id), eq(weeklyGoalSets.weekStart, weekStart)))
      .limit(1);
    const rows = await getRows(db, user.id);
    if (!set) {
      const actions = suggestedWeeklyActions(goal, rows, weekStart);
      return NextResponse.json({
        goalId: goal.id,
        weekStart,
        suggestion: { actions, status: "suggested" },
        accepted: null,
      });
    }
    const actions = JSON.parse(set.actions) as GoalAction[];
    const response = toResponse(set, calculateActionProgress(actions, rows, weekStart));
    return NextResponse.json({ goalId: goal.id, weekStart, suggestion: set.status === "suggested" ? response : null, accepted: set.status === "suggested" ? null : response });
  } catch {
    return errorResponse("Failed to fetch weekly goals", 500, "WEEKLY_GOALS_READ_FAILED");
  }
}

export async function POST(request: Request) {
  const user = await getUser(request);
  if (!user) return errorResponse("Unauthorized", 401, "AUTH_REQUIRED");
  const body = parseBody(await request.json().catch(() => null));
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const goal = await findGoal(db, user.id, body?.goalId, true);
    if (!goal) return errorResponse("Active goal not found", 404, "GOAL_NOT_FOUND");
    const weekStart = body?.weekStart || getWeekStart(new Date())!;
    if (!isCanonicalWeek(weekStart)) return errorResponse("Invalid weekStart", 400, "INVALID_WEEK");
    const rows = await getRows(db, user.id);
    const actions = body?.actions || suggestedWeeklyActions(goal, rows, weekStart);
    const [existingSet] = await db
      .select({ id: weeklyGoalSets.id })
      .from(weeklyGoalSets)
      .where(and(eq(weeklyGoalSets.goalId, goal.id), eq(weeklyGoalSets.userId, user.id), eq(weeklyGoalSets.weekStart, weekStart)))
      .limit(1);
    if (existingSet) return errorResponse("A weekly goal set already exists for this week", 409, "WEEKLY_GOAL_SET_EXISTS");
    if (!validateWeeklyActions(actions)) return errorResponse("Invalid weekly goal actions", 400, "INVALID_WEEKLY_ACTIONS");
    const status = body?.status || "suggested";
    const createdAt = new Date().toISOString();
    const set = {
      id: crypto.randomUUID(),
      userId: user.id,
      goalId: goal.id,
      weekStart,
      status,
      actions: JSON.stringify(actions),
      acceptedAt: status === "suggested" ? null : createdAt,
      createdAt,
      updatedAt: createdAt,
    } as const;
    await db.insert(weeklyGoalSets).values(set);
    return NextResponse.json(toResponse(set, calculateActionProgress(actions, rows, weekStart)), { status: 201 });
  } catch {
    return errorResponse("Failed to create weekly goals", 500, "WEEKLY_GOALS_CREATE_FAILED");
  }
}

export async function PATCH(request: Request) {
  const user = await getUser(request);
  if (!user) return errorResponse("Unauthorized", 401, "AUTH_REQUIRED");
  const body = parseBody(await request.json().catch(() => null));
  if (!body?.id) return errorResponse("Weekly goal set id is required", 400, "WEEKLY_GOAL_SET_ID_REQUIRED");
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const [set] = await db
      .select()
      .from(weeklyGoalSets)
      .where(and(eq(weeklyGoalSets.id, body.id), eq(weeklyGoalSets.userId, user.id)))
      .limit(1);
    if (!set) return errorResponse("Weekly goal set not found", 404, "WEEKLY_GOAL_SET_NOT_FOUND");
    const [parentGoal] = await db
      .select({ id: trainingGoals.id })
      .from(trainingGoals)
      .where(and(eq(trainingGoals.id, set.goalId), eq(trainingGoals.userId, user.id), eq(trainingGoals.status, "active")))
      .limit(1);
    if (!parentGoal) return errorResponse("Only active goals can be changed", 409, "GOAL_NOT_ACTIVE");
    const actions = body.actions || (JSON.parse(set.actions) as GoalAction[]);
    if (!validateWeeklyActions(actions)) return errorResponse("Invalid weekly goal actions", 400, "INVALID_WEEKLY_ACTIONS");
    const status = body.status || set.status;
    if (status === "suggested" && body.status !== "suggested") return errorResponse("Suggested goals must be accepted or adjusted explicitly", 409, "WEEKLY_GOALS_NOT_ACCEPTED");
    const updatedAt = new Date().toISOString();
    const updated = { ...set, actions: JSON.stringify(actions), status, acceptedAt: status === "suggested" ? null : set.acceptedAt || updatedAt, updatedAt };
    await db.update(weeklyGoalSets).set({ actions: updated.actions, status: updated.status, acceptedAt: updated.acceptedAt, updatedAt }).where(eq(weeklyGoalSets.id, set.id));
    const rows = await getRows(db, user.id);
    return NextResponse.json(toResponse(updated, calculateActionProgress(actions, rows, set.weekStart)));
  } catch {
    return errorResponse("Failed to update weekly goals", 500, "WEEKLY_GOALS_UPDATE_FAILED");
  }
}
