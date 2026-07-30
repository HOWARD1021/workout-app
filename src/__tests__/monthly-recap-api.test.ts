import { beforeEach, describe, expect, it, vi } from "vitest";

const monthlyRows = vi.hoisted(() => ({
  current: [
    {
      workoutId: "workout-1",
      startedAt: "2026-07-10T10:00:00.000Z",
      endedAt: "2026-07-10T11:00:00.000Z",
      logId: "log-1",
      exerciseId: "bench",
      exerciseName: "Bench Press",
      muscleGroup: "Chest",
      weight: 80,
      reps: 8,
    },
    {
      workoutId: "workout-1",
      startedAt: "2026-07-10T10:00:00.000Z",
      endedAt: "2026-07-10T11:00:00.000Z",
      logId: "log-2",
      exerciseId: "bench",
      exerciseName: "Bench Press",
      muscleGroup: "Chest",
      weight: 75,
      reps: 8,
    },
    {
      workoutId: "workout-2",
      startedAt: "2026-07-20T10:00:00.000Z",
      endedAt: "2026-07-20T10:45:00.000Z",
      logId: "log-3",
      exerciseId: "squat",
      exerciseName: "Squat",
      muscleGroup: "Legs",
      weight: 100,
      reps: 5,
    },
  ],
}));

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(async () => ({ id: "user-1" })),
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: vi.fn(() => ({ env: { DB: {} } })),
}));

vi.mock("drizzle-orm", () => ({
  and: vi.fn(),
  asc: vi.fn(),
  eq: vi.fn(),
  gte: vi.fn(),
  isNull: vi.fn(),
  lt: vi.fn(),
}));

vi.mock("@/lib/db", () => {
  type QueryChain = {
    from: () => QueryChain;
    leftJoin: () => QueryChain;
    where: () => QueryChain;
    orderBy: () => Promise<typeof monthlyRows.current>;
  };

  const chain = {} as QueryChain;
  chain.from = () => chain;
  chain.leftJoin = () => chain;
  chain.where = () => chain;
  chain.orderBy = async () => monthlyRows.current;

  return {
    getDb: () => ({
      select: vi.fn(() => chain),
    }),
    workouts: {
      id: "workouts.id",
      userId: "workouts.user_id",
      startedAt: "workouts.started_at",
      endedAt: "workouts.ended_at",
      deletedAt: "workouts.deleted_at",
    },
    workoutLogs: {
      id: "workout_logs.id",
      workoutId: "workout_logs.workout_id",
      exerciseId: "workout_logs.exercise_id",
      weight: "workout_logs.weight",
      reps: "workout_logs.reps",
    },
    exercises: {
      id: "exercises.id",
      name: "exercises.name",
      muscleGroup: "exercises.muscle_group",
    },
  };
});

describe("monthly recap API", () => {
  beforeEach(() => {
    monthlyRows.current = [
      {
        workoutId: "workout-1",
        startedAt: "2026-07-10T10:00:00.000Z",
        endedAt: "2026-07-10T11:00:00.000Z",
        logId: "log-1",
        exerciseId: "bench",
        exerciseName: "Bench Press",
        muscleGroup: "Chest",
        weight: 80,
        reps: 8,
      },
      {
        workoutId: "workout-1",
        startedAt: "2026-07-10T10:00:00.000Z",
        endedAt: "2026-07-10T11:00:00.000Z",
        logId: "log-2",
        exerciseId: "bench",
        exerciseName: "Bench Press",
        muscleGroup: "Chest",
        weight: 75,
        reps: 8,
      },
      {
        workoutId: "workout-2",
        startedAt: "2026-07-20T10:00:00.000Z",
        endedAt: "2026-07-20T10:45:00.000Z",
        logId: "log-3",
        exerciseId: "squat",
        exerciseName: "Squat",
        muscleGroup: "Legs",
        weight: 100,
        reps: 5,
      },
    ];
  });

  it("aggregates monthly workouts, exercises, and performance totals", async () => {
    const { GET } = await import("@/app/api/analytics/monthly-recap/route");

    const response = await GET(
      new Request(
        "https://example.com/api/analytics/monthly-recap?month=2026-07&start=2026-06-30T16:00:00.000Z&end=2026-07-31T16:00:00.000Z"
      )
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      month: "2026-07",
      workoutCount: 2,
      exerciseCount: 2,
      totalSets: 3,
      totalReps: 21,
      totalVolume: 1740,
      totalDurationMinutes: 105,
      averageDurationMinutes: 53,
      exercises: [
        {
          exerciseId: "bench",
          exerciseName: "Bench Press",
          totalSets: 2,
          totalReps: 16,
          totalVolume: 1240,
          maxWeight: 80,
          workoutCount: 1,
        },
        {
          exerciseId: "squat",
          exerciseName: "Squat",
          totalSets: 1,
          totalReps: 5,
          totalVolume: 500,
          maxWeight: 100,
          workoutCount: 1,
        },
      ],
      muscleGroups: [
        { muscleGroup: "Chest", totalSets: 2, totalVolume: 1240 },
        { muscleGroup: "Legs", totalSets: 1, totalVolume: 500 },
      ],
    });
  });

  it("rejects invalid date ranges", async () => {
    const { GET } = await import("@/app/api/analytics/monthly-recap/route");

    const response = await GET(
      new Request(
        "https://example.com/api/analytics/monthly-recap?month=2026-07&start=bad&end=2026-07-31T16:00:00.000Z"
      )
    );

    expect(response.status).toBe(400);
  });
});
