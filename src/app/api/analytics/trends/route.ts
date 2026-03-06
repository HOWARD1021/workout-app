import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, workouts, workoutLogs, exercises } from "@/lib/db";
import { eq, and, isNull, gte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    // Get the date 8 weeks ago
    const eightWeeksAgo = new Date();
    eightWeeksAgo.setDate(eightWeeksAgo.getDate() - 56);
    const sinceDate = eightWeeksAgo.toISOString();

    // Get all workout logs with dates from last 8 weeks
    const results = await db
      .select({
        exerciseId: workoutLogs.exerciseId,
        exerciseName: exercises.name,
        muscleGroup: exercises.muscleGroup,
        weight: workoutLogs.weight,
        reps: workoutLogs.reps,
        startedAt: workouts.startedAt,
      })
      .from(workoutLogs)
      .innerJoin(exercises, eq(workoutLogs.exerciseId, exercises.id))
      .innerJoin(workouts, eq(workoutLogs.workoutId, workouts.id))
      .where(
        and(
          eq(workouts.userId, user.id),
          isNull(workouts.deletedAt),
          gte(workouts.startedAt, sinceDate)
        )
      );

    // Group by week and muscle group
    const weeklyByMuscle: Record<string, Record<string, number>> = {};
    // Group by week and exercise (for max weight trend)
    const weeklyByExercise: Record<string, Record<string, { maxWeight: number; totalVolume: number }>> = {};

    // Weekly frequency (workouts per week)
    const weeklyWorkoutDates: Record<string, Set<string>> = {};

    for (const row of results) {
      const date = new Date(row.startedAt);
      const weekStart = getWeekStart(date);
      const weekKey = weekStart.toISOString().split("T")[0];
      const mg = row.muscleGroup || "other";
      const volume = (row.weight || 0) * (row.reps || 0);

      // Muscle group weekly volume
      if (!weeklyByMuscle[weekKey]) weeklyByMuscle[weekKey] = {};
      weeklyByMuscle[weekKey][mg] = (weeklyByMuscle[weekKey][mg] || 0) + volume;

      // Exercise weekly trends
      const exKey = row.exerciseId;
      if (!weeklyByExercise[weekKey]) weeklyByExercise[weekKey] = {};
      if (!weeklyByExercise[weekKey][exKey]) {
        weeklyByExercise[weekKey][exKey] = { maxWeight: 0, totalVolume: 0 };
      }
      weeklyByExercise[weekKey][exKey].maxWeight = Math.max(
        weeklyByExercise[weekKey][exKey].maxWeight,
        row.weight || 0
      );
      weeklyByExercise[weekKey][exKey].totalVolume += volume;

      // Weekly frequency
      if (!weeklyWorkoutDates[weekKey]) weeklyWorkoutDates[weekKey] = new Set();
      weeklyWorkoutDates[weekKey].add(date.toISOString().split("T")[0]);
    }

    // Build ordered week list (last 8 weeks)
    const weeks: string[] = [];
    for (let i = 7; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i * 7);
      weeks.push(getWeekStart(d).toISOString().split("T")[0]);
    }

    // Build exercise name map
    const exerciseNames: Record<string, string> = {};
    const exerciseMuscleGroups: Record<string, string> = {};
    for (const row of results) {
      exerciseNames[row.exerciseId] = row.exerciseName;
      exerciseMuscleGroups[row.exerciseId] = row.muscleGroup || "other";
    }

    // Format weekly frequency
    const weeklyFrequency = weeks.map((week) => ({
      week,
      count: weeklyWorkoutDates[week]?.size || 0,
    }));

    // Format muscle group trends
    const allMuscleGroups = [...new Set(results.map((r) => r.muscleGroup || "other"))];
    const muscleGroupTrends = allMuscleGroups.map((mg) => ({
      muscleGroup: mg,
      weeks: weeks.map((week) => ({
        week,
        volume: Math.round(weeklyByMuscle[week]?.[mg] || 0),
      })),
    }));

    // Format exercise trends (top exercises by total volume)
    const exerciseTotals: Record<string, number> = {};
    for (const weekData of Object.values(weeklyByExercise)) {
      for (const [exId, data] of Object.entries(weekData)) {
        exerciseTotals[exId] = (exerciseTotals[exId] || 0) + data.totalVolume;
      }
    }
    const topExercises = Object.entries(exerciseTotals)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 6)
      .map(([exId]) => exId);

    const exerciseTrends = topExercises.map((exId) => ({
      exerciseId: exId,
      exerciseName: exerciseNames[exId],
      muscleGroup: exerciseMuscleGroups[exId],
      weeks: weeks.map((week) => ({
        week,
        maxWeight: weeklyByExercise[week]?.[exId]?.maxWeight || 0,
        volume: Math.round(weeklyByExercise[week]?.[exId]?.totalVolume || 0),
      })),
    }));

    return NextResponse.json({
      weeks,
      weeklyFrequency,
      muscleGroupTrends,
      exerciseTrends,
    });
  } catch (error) {
    console.error("Failed to fetch trends:", error);
    return NextResponse.json({ error: "Failed to fetch trends" }, { status: 500 });
  }
}

function getWeekStart(date: Date): Date {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1); // Monday start
  d.setDate(diff);
  d.setHours(0, 0, 0, 0);
  return d;
}
