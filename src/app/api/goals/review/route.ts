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
  aggregateMetricWeeks,
  aggregateStrengthWeeks,
  calculateActionProgress,
  calculateProgressDelta,
  getWeekStart,
  isCompletedWorkout,
  isQualifyingSet,
  type GoalAction,
  type GoalWorkoutRow,
} from "@/lib/goal-aggregation";
import { suggestedWeeklyActions } from "@/lib/weekly-goal-suggestions";

async function getUser(request: Request) {
  try {
    return await getCurrentUser(request);
  } catch {
    return null;
  }
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

function matchesGoal(row: GoalWorkoutRow, goal: typeof trainingGoals.$inferSelect) {
  return goal.type === "strength" ? row.exerciseId === goal.exerciseId : true;
}

function goalResponse(goal: typeof trainingGoals.$inferSelect) {
  return {
    id: goal.id,
    type: goal.type,
    name: goal.name,
    exerciseId: goal.exerciseId,
    baseline: goal.baseline,
    target: goal.target,
    windowWeeks: goal.windowWeeks,
    startsAt: goal.startsAt,
    endsAt: goal.endsAt,
    status: goal.status,
  };
}

function parseActions(set: typeof weeklyGoalSets.$inferSelect | undefined) {
  if (!set) return [] as GoalAction[];
  try {
    return JSON.parse(set.actions) as GoalAction[];
  } catch {
    return [] as GoalAction[];
  }
}

export async function GET(request: Request) {
  const user = await getUser(request);
  if (!user) return NextResponse.json({ error: "Unauthorized", code: "AUTH_REQUIRED" }, { status: 401 });
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const params = new URL(request.url).searchParams;
    const goalId = params.get("goalId") ?? params.get("goal_id");
    const [goal] = await db
      .select()
      .from(trainingGoals)
      .where(
        goalId
          ? and(eq(trainingGoals.id, goalId), eq(trainingGoals.userId, user.id))
          : and(eq(trainingGoals.userId, user.id), eq(trainingGoals.status, "active"))
      )
      .limit(1);
    if (!goal) {
      return NextResponse.json({
        activeGoal: null,
        state: "no-goal",
        weeklyProgress: [],
        growthCurve: [],
        timeline: [],
        milestones: [],
        supportingMetrics: {
          frequency: { value: 0, label: "本週訓練次數" },
          volume: { value: 0, label: "本週訓練量" },
        },
      });
    }

    const rows = await getRows(db, user.id);
    const hasHistory = rows.some((row) => isCompletedWorkout(row) && isQualifyingSet(row));
    const weekStart = getWeekStart(new Date())!;
    const [set] = await db
      .select()
      .from(weeklyGoalSets)
      .where(and(eq(weeklyGoalSets.goalId, goal.id), eq(weeklyGoalSets.weekStart, weekStart), eq(weeklyGoalSets.userId, user.id)))
      .limit(1);
    const actions = set ? parseActions(set) : suggestedWeeklyActions(goal, rows, weekStart);
    const progress = set && set.status !== "suggested" ? calculateActionProgress(actions, rows, weekStart) : [];
    const growthCurve = goal.type === "strength"
      ? goal.exerciseId
        ? aggregateStrengthWeeks(rows, goal.exerciseId, goal.startsAt, goal.windowWeeks)
        : []
      : aggregateMetricWeeks(rows, goal.type, goal.startsAt, goal.windowWeeks);
    const currentPoint = growthCurve.find((point) => point.weekStart === weekStart) ?? null;
    const currentProgressValue = currentPoint?.value ?? null;
    const relevantRows = rows.filter(
      (row) => matchesGoal(row, goal) && isCompletedWorkout(row) && isQualifyingSet(row) && getWeekStart(row.startedAt) === weekStart
    );
    const workoutMap = new Map<string, { workoutId: string; date: string; exerciseNames: Set<string>; sets: Array<{ logId: string; exerciseName: string | null; weight: number; reps: number; volume: number }> }>();
    for (const row of relevantRows) {
      const workout = workoutMap.get(row.workoutId) ?? { workoutId: row.workoutId, date: row.startedAt, exerciseNames: new Set<string>(), sets: [] };
      if (row.exerciseName) workout.exerciseNames.add(row.exerciseName);
      workout.sets.push({ logId: row.logId!, exerciseName: row.exerciseName, weight: row.weight!, reps: row.reps!, volume: row.weight! * row.reps! });
      workoutMap.set(row.workoutId, workout);
    }
    const timeline = [...workoutMap.values()].map((workout) => ({
      workoutId: workout.workoutId,
      date: workout.date,
      exercises: [...workout.exerciseNames],
      setCount: workout.sets.length,
      volume: Math.round(workout.sets.reduce((sum, setItem) => sum + setItem.volume, 0) * 100) / 100,
      sets: workout.sets,
    }));
    const frequencyPoint = aggregateMetricWeeks(rows, "frequency", weekStart, 1)[0];
    const volumePoint = aggregateMetricWeeks(rows, "volume", weekStart, 1)[0];
    const completedActions = progress.filter((action) => action.completed).length;
    const expectedActions = progress.length;
    const delta = calculateProgressDelta(goal.baseline, currentProgressValue);
    const milestones = growthCurve
      .filter((point) => point.value !== null && point.value >= goal.target)
      .slice(0, 1)
      .map((point) => ({ weekStart: point.weekStart, kind: "target-reached", label: "目標達成" }));
    const firstNewRecord = growthCurve.find(
      (point) => point.value !== null && point.value > goal.baseline
    );
    if (firstNewRecord && !milestones.some((milestone) => milestone.weekStart === firstNewRecord.weekStart)) {
      milestones.unshift({ weekStart: firstNewRecord.weekStart, kind: "pr", label: "新 PR" });
    }

    return NextResponse.json({
      activeGoal: goalResponse(goal),
      state: hasHistory ? "goal-ready" : "no-history",
      currentWeekStart: weekStart,
      weeklyGoalSet: set
        ? { id: set.id, status: set.status, actions, acceptedAt: set.acceptedAt }
        : { id: "", status: "suggested", actions, acceptedAt: null },
      weeklyProgress: progress,
      progressSummary: {
        completedActions,
        expectedActions,
        currentValue: currentProgressValue,
        baseline: goal.baseline,
        delta,
        hasObservation: currentProgressValue !== null,
      },
      growthCurve,
      milestones,
      timeline,
      supportingMetrics: {
        frequency: { value: frequencyPoint?.value ?? 0, label: "本週訓練次數" },
        volume: { value: volumePoint?.value ?? 0, label: "本週訓練量" },
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to build training review", code: "GOAL_REVIEW_FAILED" }, { status: 500 });
  }
}
