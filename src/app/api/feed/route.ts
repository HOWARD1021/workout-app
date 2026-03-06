import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, activityFeed, friendships, user as userTable } from "@/lib/db";
import { eq, or, and, desc, inArray } from "drizzle-orm";
import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/auth";

// GET: Get activity feed for user + friends
export async function GET(request: Request) {
  try {
    const currentUser = await getCurrentUser(request);
    if (!currentUser) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    // Get accepted friends
    const acceptedFriendships = await db
      .select()
      .from(friendships)
      .where(
        and(
          eq(friendships.status, "accepted"),
          or(
            eq(friendships.requesterId, currentUser.id),
            eq(friendships.addresseeId, currentUser.id)
          )
        )
      );

    const friendIds = acceptedFriendships.map((f) =>
      f.requesterId === currentUser.id ? f.addresseeId : f.requesterId
    );

    // Get feed for user + friends
    const userIds = [currentUser.id, ...friendIds];

    const feed = await db
      .select()
      .from(activityFeed)
      .where(inArray(activityFeed.userId, userIds))
      .orderBy(desc(activityFeed.createdAt))
      .limit(50);

    // Get user details
    const feedUserIds = [...new Set(feed.map((f) => f.userId))];
    const users = feedUserIds.length > 0
      ? await db
          .select({ id: userTable.id, name: userTable.name, image: userTable.image })
          .from(userTable)
          .where(inArray(userTable.id, feedUserIds))
      : [];

    const userMap = new Map(users.map((u) => [u.id, u]));

    const enrichedFeed = feed.map((item) => ({
      ...item,
      userName: userMap.get(item.userId)?.name || "Unknown",
      userImage: userMap.get(item.userId)?.image || null,
      isOwn: item.userId === currentUser.id,
    }));

    return NextResponse.json(enrichedFeed);
  } catch (error) {
    console.error("Failed to fetch feed:", error);
    return NextResponse.json({ error: "Failed to fetch feed" }, { status: 500 });
  }
}
