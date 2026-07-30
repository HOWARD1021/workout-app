export type GoalType = "strength" | "frequency" | "volume";

export type GoalAction = {
  id: string;
  label: string;
  muscleGroup?: string;
  exerciseId?: string;
  expectedSessions: number;
};

export type GoalWorkoutRow = {
  workoutId: string;
  startedAt: string;
  endedAt: string | null;
  deletedAt: string | null;
  logId: string | null;
  exerciseId: string | null;
  exerciseName: string | null;
  muscleGroup: string | null;
  weight: number | null;
  reps: number | null;
  setOrder?: number | null;
};

export type GrowthEvidence = {
  logId: string;
  workoutId: string;
  date: string;
  exerciseName: string | null;
  actualWeight: number;
  reps: number;
  estimated1RM: number;
};

export type GrowthPoint = {
  weekStart: string;
  value: number | null;
  actualWeight: number | null;
  reps: number | null;
  setCount: number;
  weeklyVolume: number;
  evidence: GrowthEvidence[];
};

export type WeeklyActionProgress = GoalAction & {
  achievedSessions: number;
  completed: boolean;
  evidenceWorkoutIds: string[];
};

const DAY_MS = 24 * 60 * 60 * 1000;

export function isCompletedWorkout(row: Pick<GoalWorkoutRow, "startedAt" | "endedAt" | "deletedAt">) {
  return (
    row.deletedAt === null &&
    typeof row.endedAt === "string" &&
    row.endedAt.length > 0 &&
    Number.isFinite(new Date(row.startedAt).getTime()) &&
    Number.isFinite(new Date(row.endedAt).getTime()) &&
    new Date(row.endedAt).getTime() >= new Date(row.startedAt).getTime()
  );
}

export function isQualifyingSet(row: Pick<GoalWorkoutRow, "weight" | "reps" | "logId">) {
  return (
    row.logId !== null &&
    typeof row.weight === "number" &&
    Number.isFinite(row.weight) &&
    row.weight > 0 &&
    typeof row.reps === "number" &&
    Number.isFinite(row.reps) &&
    row.reps > 0
  );
}

/** Epley is used only as a comparable estimate; it is not an actual lifted weight. */
export function estimateOneRepMax(weight: number, reps: number) {
  if (!Number.isFinite(weight) || !Number.isFinite(reps) || weight <= 0 || reps <= 0) {
    return null;
  }
  return Math.round(weight * (1 + reps / 30) * 100) / 100;
}

export function getWeekStart(value: string | Date) {
  const date = value instanceof Date ? new Date(value) : new Date(value);
  if (!Number.isFinite(date.getTime())) return null;
  const utcDay = date.getUTCDay();
  const daysSinceMonday = (utcDay + 6) % 7;
  const start = new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
  start.setUTCDate(start.getUTCDate() - daysSinceMonday);
  return start.toISOString().slice(0, 10);
}

export function addWeeks(weekStart: string, weeks: number) {
  const date = new Date(`${weekStart}T00:00:00.000Z`);
  if (!Number.isFinite(date.getTime())) return null;
  date.setUTCDate(date.getUTCDate() + weeks * 7);
  return date.toISOString().slice(0, 10);
}

export function enumerateWeeks(start: string, count: number) {
  const safeCount = Math.max(0, Math.floor(count));
  return Array.from({ length: safeCount }, (_, index) => addWeeks(start, index)).filter(
    (week): week is string => week !== null
  );
}

function isWithinWeek(startedAt: string, weekStart: string) {
  const start = new Date(`${weekStart}T00:00:00.000Z`).getTime();
  const end = start + 7 * DAY_MS;
  const timestamp = new Date(startedAt).getTime();
  return Number.isFinite(timestamp) && timestamp >= start && timestamp < end;
}

function completedQualifyingRows(rows: GoalWorkoutRow[]) {
  return rows.filter((row) => isCompletedWorkout(row) && isQualifyingSet(row));
}

export function aggregateStrengthWeeks(
  rows: GoalWorkoutRow[],
  exerciseId: string,
  goalStart: string,
  windowWeeks: number
): GrowthPoint[] {
  const qualifying = completedQualifyingRows(rows).filter((row) => row.exerciseId === exerciseId);
  return enumerateWeeks(goalStart, windowWeeks).map((weekStart) => {
    const weekRows = qualifying.filter((row) => isWithinWeek(row.startedAt, weekStart));
    const evidence = weekRows
      .map((row) => {
        const estimated1RM = estimateOneRepMax(row.weight!, row.reps!);
        if (estimated1RM === null) return null;
        return {
          logId: row.logId!,
          workoutId: row.workoutId,
          date: row.startedAt,
          exerciseName: row.exerciseName,
          actualWeight: row.weight!,
          reps: row.reps!,
          estimated1RM,
        } satisfies GrowthEvidence;
      })
      .filter((item): item is GrowthEvidence => item !== null)
      .sort((a, b) => b.estimated1RM - a.estimated1RM);
    const best = evidence[0];
    return {
      weekStart,
      value: best?.estimated1RM ?? null,
      actualWeight: best?.actualWeight ?? null,
      reps: best?.reps ?? null,
      setCount: weekRows.length,
      weeklyVolume: weekRows.reduce((sum, row) => sum + row.weight! * row.reps!, 0),
      evidence,
    };
  });
}

export function aggregateMetricWeeks(
  rows: GoalWorkoutRow[],
  type: Exclude<GoalType, "strength">,
  goalStart: string,
  windowWeeks: number,
  exerciseId?: string | null
): GrowthPoint[] {
  const qualifying = completedQualifyingRows(rows).filter(
    (row) => !exerciseId || row.exerciseId === exerciseId
  );
  return enumerateWeeks(goalStart, windowWeeks).map((weekStart) => {
    const weekRows = qualifying.filter((row) => isWithinWeek(row.startedAt, weekStart));
    const workoutIds = new Set(weekRows.map((row) => row.workoutId));
    const weeklyVolume = weekRows.reduce((sum, row) => sum + row.weight! * row.reps!, 0);
    return {
      weekStart,
      value: type === "frequency" ? workoutIds.size : Math.round(weeklyVolume * 100) / 100,
      actualWeight: null,
      reps: null,
      setCount: weekRows.length,
      weeklyVolume,
      evidence: [],
    };
  });
}

export function calculateGoalBaseline(
  rows: GoalWorkoutRow[],
  type: GoalType,
  exerciseId?: string | null,
  baselineStart?: string
) {
  const qualifying = completedQualifyingRows(rows).filter(
    (row) => !exerciseId || row.exerciseId === exerciseId
  );
  if (type === "strength") {
    return qualifying.reduce((best, row) => {
      const estimate = estimateOneRepMax(row.weight!, row.reps!);
      return estimate === null ? best : Math.max(best, estimate);
    }, 0);
  }

  const weeks = new Map<string, { workouts: Set<string>; volume: number }>();
  for (const row of qualifying) {
    const week = getWeekStart(row.startedAt);
    if (!week) continue;
    const current = weeks.get(week) ?? { workouts: new Set<string>(), volume: 0 };
    current.workouts.add(row.workoutId);
    current.volume += row.weight! * row.reps!;
    weeks.set(week, current);
  }
  if (weeks.size === 0) return 0;
  const weekKeys = baselineStart
    ? enumerateWeeks(addWeeks(getWeekStart(baselineStart)!, -8)!, 8)
    : [...weeks.keys()];
  const values = weekKeys.map((weekKey) => {
    const week = weeks.get(weekKey);
    return type === "frequency" ? week?.workouts.size ?? 0 : week?.volume ?? 0;
  });
  return Math.round((values.reduce((sum, value) => sum + value, 0) / values.length) * 100) / 100;
}

export function calculateActionProgress(
  actions: GoalAction[],
  rows: GoalWorkoutRow[],
  weekStart: string
): WeeklyActionProgress[] {
  const qualifying = completedQualifyingRows(rows).filter((row) => isWithinWeek(row.startedAt, weekStart));
  return actions.map((action) => {
    const matching = qualifying.filter(
      (row) =>
        action.exerciseId
          ? row.exerciseId === action.exerciseId
          : action.muscleGroup
            ? row.muscleGroup === action.muscleGroup
            : false
    );
    const evidenceWorkoutIds = [...new Set(matching.map((row) => row.workoutId))];
    return {
      ...action,
      achievedSessions: evidenceWorkoutIds.length,
      completed: evidenceWorkoutIds.length >= action.expectedSessions,
      evidenceWorkoutIds,
    };
  });
}

export function calculateProgressDelta(baseline: number, current: number | null) {
  if (current === null) return null;
  return Math.round((current - baseline) * 100) / 100;
}
