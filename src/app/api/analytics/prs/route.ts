import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, workoutLogs, workouts, exercises } from "@/lib/db";
import { eq, and, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export interface ExercisePR {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  maxWeight: number;
  maxWeightReps: number;
  maxWeightDate: string;
  maxVolume: number;
  maxVolumeWeight: number;
  maxVolumeReps: number;
  maxVolumeDate: string;
}

export async function GET(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    // Get all completed workout logs for this user
    const logs = await db
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
          isNull(workouts.deletedAt)
        )
      );

    // Calculate PRs per exercise
    const prMap: Record<string, ExercisePR> = {};

    for (const log of logs) {
      const weight = log.weight || 0;
      const reps = log.reps || 0;
      const volume = weight * reps;

      if (!prMap[log.exerciseId]) {
        prMap[log.exerciseId] = {
          exerciseId: log.exerciseId,
          exerciseName: log.exerciseName,
          muscleGroup: log.muscleGroup || "Other",
          maxWeight: weight,
          maxWeightReps: reps,
          maxWeightDate: log.startedAt,
          maxVolume: volume,
          maxVolumeWeight: weight,
          maxVolumeReps: reps,
          maxVolumeDate: log.startedAt,
        };
        continue;
      }

      const pr = prMap[log.exerciseId];

      // Max weight PR (highest single-set weight)
      if (weight > pr.maxWeight) {
        pr.maxWeight = weight;
        pr.maxWeightReps = reps;
        pr.maxWeightDate = log.startedAt;
      }

      // Max volume PR (highest single-set volume = weight × reps)
      if (volume > pr.maxVolume) {
        pr.maxVolume = volume;
        pr.maxVolumeWeight = weight;
        pr.maxVolumeReps = reps;
        pr.maxVolumeDate = log.startedAt;
      }
    }

    // Sort by max weight descending
    const prs = Object.values(prMap).sort((a, b) => b.maxWeight - a.maxWeight);

    return NextResponse.json(prs);
  } catch (error) {
    console.error("Failed to fetch PRs:", error);
    return NextResponse.json(
      { error: "Failed to fetch PRs" },
      { status: 500 }
    );
  }
}
