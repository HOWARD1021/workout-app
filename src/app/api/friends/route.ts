import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, friendships, user as userTable } from "@/lib/db";
import { eq, or, and } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// GET: List friends and pending requests
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    // Get all friendships involving this user
    const allFriendships = await db
      .select()
      .from(friendships)
      .where(
        or(
          eq(friendships.requesterId, currentUser.id),
          eq(friendships.addresseeId, currentUser.id)
        )
      );

    // Get user details for each friend
    const friendIds = new Set<string>();
    for (const f of allFriendships) {
      friendIds.add(f.requesterId);
      friendIds.add(f.addresseeId);
    }
    friendIds.delete(currentUser.id);

    const users = friendIds.size > 0
      ? await db
          .select({ id: userTable.id, name: userTable.name, image: userTable.image })
          .from(userTable)
          .where(
            or(...[...friendIds].map((id) => eq(userTable.id, id)))
          )
      : [];

    const userMap = new Map(users.map((u) => [u.id, u]));

    const friends = allFriendships.map((f) => {
      const friendId =
        f.requesterId === currentUser.id ? f.addresseeId : f.requesterId;
      const friendUser = userMap.get(friendId);
      return {
        id: f.id,
        friendId,
        friendName: friendUser?.name || "Unknown",
        friendImage: friendUser?.image || null,
        status: f.status,
        isIncoming: f.addresseeId === currentUser.id,
        createdAt: f.createdAt,
      };
    });

    return NextResponse.json(friends);
  } catch (error) {
    console.error("Failed to fetch friends:", error);
    return NextResponse.json({ error: "Failed to fetch friends" }, { status: 500 });
  }
}

// POST: Send friend invite by email
export async function POST(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const body = (await request.json()) as { email: string };

    if (!body.email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // Find user by email
    const [targetUser] = await db
      .select()
      .from(userTable)
      .where(eq(userTable.email, body.email));

    if (!targetUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (targetUser.id === currentUser.id) {
      return NextResponse.json(
        { error: "Cannot add yourself" },
        { status: 400 }
      );
    }

    // Check if friendship already exists
    const existing = await db
      .select()
      .from(friendships)
      .where(
        or(
          and(
            eq(friendships.requesterId, currentUser.id),
            eq(friendships.addresseeId, targetUser.id)
          ),
          and(
            eq(friendships.requesterId, targetUser.id),
            eq(friendships.addresseeId, currentUser.id)
          )
        )
      );

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Friendship already exists" },
        { status: 409 }
      );
    }

    const [friendship] = await db
      .insert(friendships)
      .values({
        requesterId: currentUser.id,
        addresseeId: targetUser.id,
      })
      .returning();

    return NextResponse.json(friendship);
  } catch (error) {
    console.error("Failed to send friend invite:", error);
    return NextResponse.json(
      { error: "Failed to send invite" },
      { status: 500 }
    );
  }
}
