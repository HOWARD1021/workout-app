import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, achievements, userAchievements, workouts, workoutLogs, exercises } from "@/lib/db";
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

    // Get all achievements
    const allAchievements = await db.select().from(achievements);

    // Get user's unlocked achievements
    const unlocked = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, user.id));

    const unlockedMap = new Map(
      unlocked.map((ua) => [ua.achievementId, ua.unlockedAt])
    );

    const result = allAchievements.map((a) => ({
      ...a,
      unlocked: unlockedMap.has(a.id),
      unlockedAt: unlockedMap.get(a.id) || null,
    }));

    return NextResponse.json(result);
  } catch (error) {
    console.error("Failed to fetch achievements:", error);
    return NextResponse.json({ error: "Failed to fetch achievements" }, { status: 500 });
  }
}

// POST: Check and unlock new achievements after a workout
export async function POST(request: Request) {
  try {
    const user = await getCurrentUser(request);
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { env } = getCloudflareContext();
    const db = getDb(env.DB);

    // Get all achievements and user's existing unlocks
    const allAchievements = await db.select().from(achievements);
    const existingUnlocks = await db
      .select()
      .from(userAchievements)
      .where(eq(userAchievements.userId, user.id));

    const unlockedIds = new Set(existingUnlocks.map((u) => u.achievementId));

    // Get user stats for checking
    const userWorkouts = await db
      .select()
      .from(workouts)
      .where(and(eq(workouts.userId, user.id), isNull(workouts.deletedAt)));

    const totalWorkouts = userWorkouts.length;

    // Total volume
    let totalVolume = 0;
    for (const w of userWorkouts) {
      const logs = await db
        .select()
        .from(workoutLogs)
        .where(eq(workoutLogs.workoutId, w.id));
      for (const log of logs) {
        totalVolume += (log.weight || 0) * (log.reps || 0);
      }
    }

    // Template used count
    const templateUsed = userWorkouts.filter((w) => w.templateId !== null).length;

    // Streak calculation
    let streakDays = 0;
    if (userWorkouts.length > 0) {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const workoutDates = new Set(
        userWorkouts.map((w) => new Date(w.startedAt).toISOString().split("T")[0])
      );
      for (let i = 0; i < 365; i++) {
        const checkDate = new Date(today);
        checkDate.setDate(today.getDate() - i);
        const dateStr = checkDate.toISOString().split("T")[0];
        if (workoutDates.has(dateStr)) {
          streakDays++;
        } else if (i > 0) {
          break;
        }
      }
    }

    // Muscle groups trained
    const muscleGroupsResult = await db
      .selectDistinct({ muscleGroup: exercises.muscleGroup })
      .from(workoutLogs)
      .innerJoin(exercises, eq(workoutLogs.exerciseId, exercises.id))
      .innerJoin(workouts, eq(workoutLogs.workoutId, workouts.id))
      .where(and(eq(workouts.userId, user.id), isNull(workouts.deletedAt)));

    const muscleGroupsTrained = muscleGroupsResult.filter(
      (r) => r.muscleGroup !== null
    ).length;

    // PR count - count exercises where user has improved max weight
    // Simplified: count distinct exercises with logs
    const exerciseMaxWeights = await db
      .select({
        exerciseId: workoutLogs.exerciseId,
        maxWeight: sql<number>`MAX(${workoutLogs.weight})`,
      })
      .from(workoutLogs)
      .innerJoin(workouts, eq(workoutLogs.workoutId, workouts.id))
      .where(and(eq(workouts.userId, user.id), isNull(workouts.deletedAt)))
      .groupBy(workoutLogs.exerciseId);

    const totalPrs = exerciseMaxWeights.filter((e) => e.maxWeight && e.maxWeight > 0).length;

    // Check each achievement
    const newUnlocks: string[] = [];

    for (const achievement of allAchievements) {
      if (unlockedIds.has(achievement.id)) continue;

      let met = false;
      switch (achievement.conditionType) {
        case "total_workouts":
          met = totalWorkouts >= achievement.conditionValue;
          break;
        case "template_used":
          met = templateUsed >= achievement.conditionValue;
          break;
        case "streak_days":
          met = streakDays >= achievement.conditionValue;
          break;
        case "total_volume":
          met = totalVolume >= achievement.conditionValue;
          break;
        case "muscle_groups_trained":
          met = muscleGroupsTrained >= achievement.conditionValue;
          break;
        case "total_prs":
          met = totalPrs >= achievement.conditionValue;
          break;
      }

      if (met) {
        await db.insert(userAchievements).values({
          userId: user.id,
          achievementId: achievement.id,
        });
        newUnlocks.push(achievement.id);
      }
    }

    // Return newly unlocked achievements
    const newlyUnlocked = allAchievements.filter((a) =>
      newUnlocks.includes(a.id)
    );

    return NextResponse.json({ newUnlocks: newlyUnlocked });
  } catch (error) {
    console.error("Failed to check achievements:", error);
    return NextResponse.json({ error: "Failed to check achievements" }, { status: 500 });
  }
}
