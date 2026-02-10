import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, workoutTemplates, workoutTemplateExercises, exercises } from "@/lib/db";
import { eq } from "drizzle-orm";
import { NextResponse } from "next/server";



export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    // Get template exercises with exercise details
    const templateExercises = await db
      .select({
        id: workoutTemplateExercises.id,
        exerciseId: workoutTemplateExercises.exerciseId,
        orderIndex: workoutTemplateExercises.orderIndex,
        defaultSets: workoutTemplateExercises.defaultSets,
        defaultReps: workoutTemplateExercises.defaultReps,
        defaultWeight: workoutTemplateExercises.defaultWeight,
        exercise: {
          id: exercises.id,
          name: exercises.name,
          type: exercises.type,
          muscleGroup: exercises.muscleGroup,
        },
      })
      .from(workoutTemplateExercises)
      .leftJoin(exercises, eq(workoutTemplateExercises.exerciseId, exercises.id))
      .where(eq(workoutTemplateExercises.templateId, id))
      .orderBy(workoutTemplateExercises.orderIndex);

    return NextResponse.json(templateExercises);
  } catch (error) {
    console.error("Failed to fetch template details:", error);
    return NextResponse.json({ error: "Failed to fetch template details" }, { status: 500 });
  }
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const body = await request.json() as {
      use_count?: number;
      last_used_at?: string;
      is_favorite?: boolean;
    };

    // Update template
    const updates: Record<string, unknown> = {};
    if (body.use_count !== undefined) updates.useCount = body.use_count;
    if (body.last_used_at !== undefined) updates.lastUsedAt = body.last_used_at;
    if (body.is_favorite !== undefined) updates.isFavorite = body.is_favorite;

    if (Object.keys(updates).length > 0) {
      await db
        .update(workoutTemplates)
        .set(updates)
        .where(eq(workoutTemplates.id, id));
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to update template:", error);
    return NextResponse.json({ error: "Failed to update template" }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    // Soft delete
    await db
      .update(workoutTemplates)
      .set({ deletedAt: new Date().toISOString() })
      .where(eq(workoutTemplates.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete template:", error);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
