import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, workoutLogs, workouts } from "@/lib/db";
import { eq, inArray, desc } from "drizzle-orm";
import { NextResponse } from "next/server";



export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const body = await request.json() as { exercise_ids?: string[] };
    const exerciseIds: string[] = body.exercise_ids || [];

    if (exerciseIds.length === 0) {
      return NextResponse.json({});
    }

    // Get the most recent logs for each exercise
    const logs = await db
      .select({
        exerciseId: workoutLogs.exerciseId,
        weight: workoutLogs.weight,
        reps: workoutLogs.reps,
        startedAt: workouts.startedAt,
      })
      .from(workoutLogs)
      .innerJoin(workouts, eq(workoutLogs.workoutId, workouts.id))
      .where(inArray(workoutLogs.exerciseId, exerciseIds))
      .orderBy(desc(workouts.startedAt), desc(workoutLogs.weight));

    // Group by exercise and get the best from most recent workout
    const previousData: Record<string, { weight: number; reps: number; date: string }> = {};

    logs.forEach((log) => {
      if (!previousData[log.exerciseId] && log.weight && log.reps) {
        previousData[log.exerciseId] = {
          weight: log.weight,
          reps: log.reps,
          date: log.startedAt,
        };
      }
    });

    return NextResponse.json(previousData);
  } catch (error) {
    console.error("Failed to fetch previous data:", error);
    return NextResponse.json({ error: "Failed to fetch previous data" }, { status: 500 });
  }
}
