import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, workouts, workoutLogs, exercises } from "@/lib/db";
import { eq, isNull, desc, and } from "drizzle-orm";
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

    const result = await db
      .select()
      .from(workouts)
      .where(and(isNull(workouts.deletedAt), eq(workouts.userId, user.id)))
      .orderBy(desc(workouts.startedAt));

    // Get workout logs for each workout
    const workoutsWithLogs = await Promise.all(
      result.map(async (workout) => {
        const logs = await db
          .select({
            id: workoutLogs.id,
            weight: workoutLogs.weight,
            reps: workoutLogs.reps,
            exerciseId: workoutLogs.exerciseId,
            exercise: {
              muscleGroup: exercises.muscleGroup,
            },
          })
          .from(workoutLogs)
          .leftJoin(exercises, eq(workoutLogs.exerciseId, exercises.id))
          .where(eq(workoutLogs.workoutId, workout.id));

        return {
          ...workout,
          workout_logs: logs,
        };
      })
    );

    return NextResponse.json(workoutsWithLogs);
  } catch (error) {
    console.error("Failed to fetch workouts:", error);
    return NextResponse.json({ error: "Failed to fetch workouts" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const body = await request.json() as {
      started_at: string;
      ended_at: string;
      template_id?: string;
      note?: string;
      logs?: Array<{ exercise_id: string; set_order: number; weight: number | null; reps: number | null }>;
    };

    // Create workout with user_id
    const [workout] = await db
      .insert(workouts)
      .values({
        userId: user.id,
        startedAt: body.started_at,
        endedAt: body.ended_at,
        templateId: body.template_id || null,
        note: body.note,
      })
      .returning();

    // Create workout logs
    if (body.logs && body.logs.length > 0) {
      await db.insert(workoutLogs).values(
        body.logs.map((log: { exercise_id: string; set_order: number; weight: number | null; reps: number | null }) => ({
          workoutId: workout.id,
          exerciseId: log.exercise_id,
          setOrder: log.set_order,
          weight: log.weight,
          reps: log.reps,
        }))
      );
    }

    return NextResponse.json(workout);
  } catch (error) {
    console.error("Failed to create workout:", error);
    return NextResponse.json({ error: "Failed to create workout" }, { status: 500 });
  }
}
