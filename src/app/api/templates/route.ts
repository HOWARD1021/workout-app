import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, workoutTemplates, workoutTemplateExercises } from "@/lib/db";
import { eq, isNull, desc, sql, and, or } from "drizzle-orm";
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

    // Get templates: user's own templates + public templates (user_id IS NULL)
    const templates = await db
      .select()
      .from(workoutTemplates)
      .where(and(
        isNull(workoutTemplates.deletedAt),
        or(eq(workoutTemplates.userId, user.id), isNull(workoutTemplates.userId))
      ))
      .orderBy(
        desc(workoutTemplates.isFavorite),
        desc(workoutTemplates.useCount),
        desc(workoutTemplates.lastUsedAt)
      );

    // Get exercise count for each template
    const templatesWithCount = await Promise.all(
      templates.map(async (template) => {
        const countResult = await db
          .select({ count: sql<number>`count(*)` })
          .from(workoutTemplateExercises)
          .where(eq(workoutTemplateExercises.templateId, template.id));

        return {
          ...template,
          exercise_count: countResult[0]?.count || 0,
        };
      })
    );

    return NextResponse.json(templatesWithCount);
  } catch (error) {
    console.error("Failed to fetch templates:", error);
    return NextResponse.json({ error: "Failed to fetch templates" }, { status: 500 });
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
      name: string;
      description?: string;
      muscle_group?: string;
      is_favorite?: boolean;
      exercises?: Array<{ exercise_id: string; default_sets?: number; default_reps?: number; default_weight?: number }>;
    };

    // Create template with user_id
    const [template] = await db
      .insert(workoutTemplates)
      .values({
        userId: user.id,
        name: body.name,
        description: body.description || null,
        muscleGroup: body.muscle_group || null,
        isFavorite: body.is_favorite || false,
      })
      .returning();

    // Create template exercises
    if (body.exercises && body.exercises.length > 0) {
      await db.insert(workoutTemplateExercises).values(
        body.exercises.map((ex: { exercise_id: string; default_sets?: number; default_reps?: number; default_weight?: number }, index: number) => ({
          templateId: template.id,
          exerciseId: ex.exercise_id,
          orderIndex: index,
          defaultSets: ex.default_sets || 3,
          defaultReps: ex.default_reps || null,
          defaultWeight: ex.default_weight || null,
        }))
      );
    }

    return NextResponse.json(template);
  } catch (error) {
    console.error("Failed to create template:", error);
    return NextResponse.json({ error: "Failed to create template" }, { status: 500 });
  }
}
