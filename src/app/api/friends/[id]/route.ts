import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, friendships } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// PATCH: Accept or decline a friend request
export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const body = (await request.json()) as { status: "accepted" | "declined" };

    if (!["accepted", "declined"].includes(body.status)) {
      return NextResponse.json({ error: "Invalid status" }, { status: 400 });
    }

    // Only the addressee can accept/decline
    const [friendship] = await db
      .select()
      .from(friendships)
      .where(
        and(
          eq(friendships.id, id),
          eq(friendships.addresseeId, currentUser.id)
        )
      );

    if (!friendship) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const [updated] = await db
      .update(friendships)
      .set({ status: body.status })
      .where(eq(friendships.id, id))
      .returning();

    return NextResponse.json(updated);
  } catch (error) {
    console.error("Failed to update friendship:", error);
    return NextResponse.json(
      { error: "Failed to update" },
      { status: 500 }
    );
  }
}

// DELETE: Remove a friendship
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await params;
    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    await db.delete(friendships).where(eq(friendships.id, id));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Failed to delete friendship:", error);
    return NextResponse.json(
      { error: "Failed to delete" },
      { status: 500 }
    );
  }
}
