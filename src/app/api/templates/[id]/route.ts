import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, workoutTemplates, workoutTemplateExercises, exercises } from "@/lib/db";
import { eq, and, or, isNull } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    // Verify template belongs to user OR is a public template (user_id IS NULL)
    const [template] = await db
      .select()
      .from(workoutTemplates)
      .where(and(
        eq(workoutTemplates.id, id),
        or(eq(workoutTemplates.userId, user.id), isNull(workoutTemplates.userId))
      ));
    
    if (!template) {
      return NextResponse.json({ error: "Template not found" }, { status: 404 });
    }

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
          nameZh: exercises.nameZh,
          type: exercises.type,
          muscleGroup: exercises.muscleGroup,
          imageUrl: exercises.imageUrl,
          gifUrl: exercises.gifUrl,
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
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const body = await request.json() as {
      use_count?: number;
      last_used_at?: string;
      is_favorite?: boolean;
    };

    // Update template (only if belongs to user)
    const updates: Record<string, unknown> = {};
    if (body.use_count !== undefined) updates.useCount = body.use_count;
    if (body.last_used_at !== undefined) updates.lastUsedAt = body.last_used_at;
    if (body.is_favorite !== undefined) updates.isFavorite = body.is_favorite;

    if (Object.keys(updates).length > 0) {
      await db
        .update(workoutTemplates)
        .set(updates)
        .where(and(eq(workoutTemplates.id, id), eq(workoutTemplates.userId, user.id)));
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
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    // Soft delete (only if belongs to user)
    await db
      .update(workoutTemplates)
      .set({ deletedAt: new Date().toISOString() })
      .where(and(eq(workoutTemplates.id, id), eq(workoutTemplates.userId, user.id)));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete template:", error);
    return NextResponse.json({ error: "Failed to delete template" }, { status: 500 });
  }
}
