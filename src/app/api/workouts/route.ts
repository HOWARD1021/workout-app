import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, workouts, workoutLogs, exercises } from "@/lib/db";
import { eq, isNull, desc } from "drizzle-orm";
import { NextResponse } from "next/server";



export async function GET() {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    const result = await db
      .select()
      .from(workouts)
      .where(isNull(workouts.deletedAt))
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
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const body = await request.json() as {
      started_at: string;
      ended_at: string;
      template_id?: string;
      note?: string;
      logs?: Array<{ exercise_id: string; set_order: number; weight: number | null; reps: number | null }>;
    };

    // Create workout
    const [workout] = await db
      .insert(workouts)
      .values({
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
