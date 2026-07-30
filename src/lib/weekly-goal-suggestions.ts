import { getWeekStart } from "@/lib/goal-aggregation";
import type { GoalAction, GoalWorkoutRow } from "@/lib/goal-aggregation";
import type { TrainingGoal } from "@/lib/db";

export function suggestedWeeklyActions(
  goal: TrainingGoal,
  rows: GoalWorkoutRow[],
  weekStart: string
): GoalAction[] {
  if (goal.type === "strength" && goal.exerciseId) {
    const exerciseName = rows.find((row) => row.exerciseId === goal.exerciseId)?.exerciseName;
    return [{ id: `exercise:${goal.exerciseId}`, label: exerciseName || "目標動作", exerciseId: goal.exerciseId, expectedSessions: 1 }];
  }

  const currentWeek = new Date(`${weekStart}T00:00:00.000Z`);
  const lookback = new Date(currentWeek);
  lookback.setUTCDate(lookback.getUTCDate() - 4 * 7);
  const groups = new Map<string, Set<string>>();
  for (const row of rows) {
    const timestamp = new Date(row.startedAt).getTime();
    if (
      timestamp < lookback.getTime() ||
      timestamp >= currentWeek.getTime() ||
      !row.muscleGroup ||
      !row.endedAt ||
      !row.logId ||
      row.weight === null ||
      row.weight <= 0 ||
      row.reps === null ||
      row.reps <= 0
    ) continue;
    const workoutIds = groups.get(row.muscleGroup) ?? new Set<string>();
    workoutIds.add(row.workoutId);
    groups.set(row.muscleGroup, workoutIds);
  }
  const recentGroups = [...groups.entries()].sort(([, a], [, b]) => b.size - a.size).slice(0, 3);
  if (recentGroups.length === 0) {
    return [{ id: "group:full-body", label: "全身訓練", muscleGroup: "Full Body", expectedSessions: 1 }];
  }
  return recentGroups.map(([muscleGroup, history]) => ({
    id: `group:${muscleGroup}`,
    label: muscleGroup,
    muscleGroup,
    expectedSessions: Math.max(1, Math.min(7, Math.ceil(history.size / 4))),
  }));
}

export function validateWeeklyActions(actions: GoalAction[] | undefined) {
  if (!actions || actions.length === 0 || actions.length > 12) return false;
  return actions.every(
    (action) =>
      action &&
      typeof action.id === "string" &&
      typeof action.label === "string" &&
      Boolean(action.exerciseId) !== Boolean(action.muscleGroup) &&
      Number.isInteger(action.expectedSessions) &&
      action.expectedSessions > 0 &&
      action.expectedSessions <= 14
  );
}

export function actionWeekStart(value: string) {
  return getWeekStart(`${value}T00:00:00.000Z`) === value ? value : null;
}
