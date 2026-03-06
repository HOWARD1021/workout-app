import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, workouts, workoutLogs, exercises } from "@/lib/db";
import { eq, and, isNull, sql } from "drizzle-orm";
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

    // Get volume and set count per muscle group
    const results = await db
      .select({
        muscleGroup: exercises.muscleGroup,
        totalVolume: sql<number>`SUM(${workoutLogs.weight} * ${workoutLogs.reps})`,
        totalSets: sql<number>`COUNT(${workoutLogs.id})`,
      })
      .from(workoutLogs)
      .innerJoin(exercises, eq(workoutLogs.exerciseId, exercises.id))
      .innerJoin(workouts, eq(workoutLogs.workoutId, workouts.id))
      .where(and(eq(workouts.userId, user.id), isNull(workouts.deletedAt)))
      .groupBy(exercises.muscleGroup);

    // Filter out nulls and format
    const muscleGroups = results
      .filter((r) => r.muscleGroup !== null)
      .map((r) => ({
        muscleGroup: r.muscleGroup!,
        totalVolume: Math.round(r.totalVolume || 0),
        totalSets: r.totalSets || 0,
      }))
      .sort((a, b) => b.totalVolume - a.totalVolume);

    return NextResponse.json(muscleGroups);
  } catch (error) {
    console.error("Failed to fetch muscle group analytics:", error);
    return NextResponse.json({ error: "Failed to fetch analytics" }, { status: 500 });
  }
}
