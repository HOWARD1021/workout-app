import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, workouts, workoutLogs, exercises } from "@/lib/db";
import { and, asc, eq, gte, isNull, lt } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

type MonthRange = {
  month: string;
  start: string;
  end: string;
};

type ExerciseAggregate = {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  maxWeight: number;
  workoutIds: Set<string>;
  lastTrainedAt: string;
};

function isValidDate(value: string | null): value is string {
  if (!value) return false;
  const time = new Date(value).getTime();
  return Number.isFinite(time);
}

function getDefaultMonthRange(): MonthRange {
  const now = new Date();
  const month = `${now.getUTCFullYear()}-${String(now.getUTCMonth() + 1).padStart(2, "0")}`;
  const start = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), 1));
  const end = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth() + 1, 1));
  return { month, start: start.toISOString(), end: end.toISOString() };
}

function parseMonthRange(request: Request): MonthRange | null {
  const url = new URL(request.url);
  const start = url.searchParams.get("start");
  const end = url.searchParams.get("end");
  const month = url.searchParams.get("month");

  if (!start && !end && !month) return getDefaultMonthRange();

  if (start || end) {
    if (!isValidDate(start) || !isValidDate(end)) return null;
    if (new Date(start).getTime() >= new Date(end).getTime()) return null;
    return {
      month:
        month && /^\d{4}-\d{2}$/.test(month)
          ? month
          : start.slice(0, 7),
      start,
      end,
    };
  }

  if (!month || !/^\d{4}-\d{2}$/.test(month)) return null;
  const [year, monthNumber] = month.split("-").map(Number);
  const startDate = new Date(Date.UTC(year, monthNumber - 1, 1));
  const endDate = new Date(Date.UTC(year, monthNumber, 1));
  return {
    month,
    start: startDate.toISOString(),
    end: endDate.toISOString(),
  };
}

function durationMinutes(startedAt: string, endedAt: string | null) {
  if (!endedAt) return 0;
  const duration = new Date(endedAt).getTime() - new Date(startedAt).getTime();
  if (!Number.isFinite(duration) || duration <= 0) return 0;
  return Math.round(duration / 60000);
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const range = parseMonthRange(request);
    if (!range) {
      return NextResponse.json(
        { error: "Invalid monthly recap range" },
        { status: 400 }
      );
    }

    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    const rows = await db
      .select({
        workoutId: workouts.id,
        startedAt: workouts.startedAt,
        endedAt: workouts.endedAt,
        logId: workoutLogs.id,
        exerciseId: workoutLogs.exerciseId,
        exerciseName: exercises.name,
        muscleGroup: exercises.muscleGroup,
        weight: workoutLogs.weight,
        reps: workoutLogs.reps,
      })
      .from(workouts)
      .leftJoin(workoutLogs, eq(workoutLogs.workoutId, workouts.id))
      .leftJoin(exercises, eq(workoutLogs.exerciseId, exercises.id))
      .where(
        and(
          eq(workouts.userId, user.id),
          isNull(workouts.deletedAt),
          gte(workouts.startedAt, range.start),
          lt(workouts.startedAt, range.end)
        )
      )
      .orderBy(asc(workouts.startedAt));

    const workoutDurations = new Map<string, number>();
    const exerciseMap = new Map<string, ExerciseAggregate>();
    const muscleGroups = new Map<
      string,
      { muscleGroup: string; totalSets: number; totalVolume: number }
    >();

    let totalSets = 0;
    let totalReps = 0;
    let totalVolume = 0;

    for (const row of rows) {
      if (!workoutDurations.has(row.workoutId)) {
        workoutDurations.set(
          row.workoutId,
          durationMinutes(row.startedAt, row.endedAt)
        );
      }

      if (!row.logId || !row.exerciseId || !row.exerciseName) continue;

      const weight = Math.abs(row.weight || 0);
      const reps = row.reps || 0;
      const volume = weight * reps;
      const muscleGroup = row.muscleGroup || "Other";

      totalSets += 1;
      totalReps += reps;
      totalVolume += volume;

      const existing = exerciseMap.get(row.exerciseId) ?? {
        exerciseId: row.exerciseId,
        exerciseName: row.exerciseName,
        muscleGroup,
        totalSets: 0,
        totalReps: 0,
        totalVolume: 0,
        maxWeight: 0,
        workoutIds: new Set<string>(),
        lastTrainedAt: row.startedAt,
      };
      existing.totalSets += 1;
      existing.totalReps += reps;
      existing.totalVolume += volume;
      existing.maxWeight = Math.max(existing.maxWeight, weight);
      existing.workoutIds.add(row.workoutId);
      if (new Date(row.startedAt) > new Date(existing.lastTrainedAt)) {
        existing.lastTrainedAt = row.startedAt;
      }
      exerciseMap.set(row.exerciseId, existing);

      const mg = muscleGroups.get(muscleGroup) ?? {
        muscleGroup,
        totalSets: 0,
        totalVolume: 0,
      };
      mg.totalSets += 1;
      mg.totalVolume += volume;
      muscleGroups.set(muscleGroup, mg);
    }

    const workoutCount = workoutDurations.size;
    const totalDurationMinutes = [...workoutDurations.values()].reduce(
      (sum, minutes) => sum + minutes,
      0
    );

    return NextResponse.json({
      month: range.month,
      start: range.start,
      end: range.end,
      workoutCount,
      exerciseCount: exerciseMap.size,
      totalSets,
      totalReps,
      totalVolume: Math.round(totalVolume),
      totalDurationMinutes,
      averageDurationMinutes:
        workoutCount > 0 ? Math.round(totalDurationMinutes / workoutCount) : 0,
      exercises: [...exerciseMap.values()]
        .map((exercise) => ({
          exerciseId: exercise.exerciseId,
          exerciseName: exercise.exerciseName,
          muscleGroup: exercise.muscleGroup,
          totalSets: exercise.totalSets,
          totalReps: exercise.totalReps,
          totalVolume: Math.round(exercise.totalVolume),
          maxWeight: exercise.maxWeight,
          workoutCount: exercise.workoutIds.size,
          lastTrainedAt: exercise.lastTrainedAt,
        }))
        .sort((a, b) => b.totalVolume - a.totalVolume),
      muscleGroups: [...muscleGroups.values()]
        .map((group) => ({
          ...group,
          totalVolume: Math.round(group.totalVolume),
        }))
        .sort((a, b) => b.totalVolume - a.totalVolume),
    });
  } catch (error) {
    console.error("Failed to fetch monthly recap:", error);
    return NextResponse.json(
      { error: "Failed to fetch monthly recap" },
      { status: 500 }
    );
  }
}
