import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, exercises } from "@/lib/db";
import { isNull } from "drizzle-orm";
import { NextResponse } from "next/server";



export async function GET() {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    const result = await db
      .select()
      .from(exercises)
      .where(isNull(exercises.deletedAt))
      .orderBy(exercises.name);

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch exercises:", error);
    return NextResponse.json({ error: "Failed to fetch exercises" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const body = await request.json() as { name: string; type: string; muscle_group: string };

    const result = await db
      .insert(exercises)
      .values([{
        name: body.name,
        type: body.type as "Strength" | "Cardio" | "Flexibility" | "Other",
        muscleGroup: body.muscle_group as "Chest" | "Back" | "Legs" | "Shoulders" | "Arms" | "Core" | "Full Body" | "Other",
        isCustom: true,
      }])
      .returning();

    return NextResponse.json(result[0]);
  } catch (error) {
    console.error("Failed to create exercise:", error);
    return NextResponse.json({ error: "Failed to create exercise" }, { status: 500 });
  }
}
