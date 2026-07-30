import { describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(async () => ({ id: "user-1" })),
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: vi.fn(() => ({ env: { DB: {} } })),
}));

const tables = {
  exercises: "exercises",
  workoutTemplates: "workout_templates",
  workouts: "workouts",
  workoutLogs: "workout_logs",
};

const workoutRow = {
  id: "submission-1",
  userId: "user-1",
  startedAt: "2026-07-26T10:00:00.000Z",
  endedAt: "2026-07-26T11:00:00.000Z",
  templateId: null,
  note: null,
};

const batch = vi.fn(async (queries: unknown[]) =>
  queries.map(() => ({ success: true }))
);

vi.mock("@/lib/db", () => {
  type QueryChain = {
    from: () => QueryChain;
    where: () => QueryChain | Promise<unknown[]>;
    limit: () => Promise<unknown[]>;
  };

  const makeChain = (
    selection?: Record<string, unknown>,
    result: unknown[] = [workoutRow]
  ) => {
    const chain = {} as QueryChain;
    chain.from = () => chain;
    chain.where =
      selection?.id === "exercises.id"
        ? async () => [{ id: "exercise-1" }]
        : () => chain;
    chain.limit = async () => {
      if (selection?.id === "workout_templates.id") {
        return [];
      }
      return result;
    };
    return chain;
  };

  let unfilteredSelectCount = 0;
  const db = {
    select: vi.fn((selection?: Record<string, unknown>) => {
      if (!selection) {
        const result = unfilteredSelectCount++ === 0 ? [] : [workoutRow];
        return makeChain(selection, result);
      }
      return makeChain(selection);
    }),
    insert: vi.fn((table: string) => ({
      values: vi.fn((values: unknown) => ({ table, values })),
    })),
    batch,
  };

  return {
    getDb: () => db,
    exercises: { id: "exercises.id" },
    workoutTemplates: { id: "workout_templates.id" },
    workouts: tables.workouts,
    workoutLogs: tables.workoutLogs,
    workoutSaveEvents: "workout_save_events",
  };
});

describe("workouts API", () => {
  it("uses D1 batch writes instead of an unsupported explicit transaction", async () => {
    const { POST } = await import("@/app/api/workouts/route");

    const response = await POST(
      new Request("https://example.com/api/workouts", {
        method: "POST",
        body: JSON.stringify({
          id: "submission-1",
          started_at: workoutRow.startedAt,
          ended_at: workoutRow.endedAt,
          logs: [
            {
              exercise_id: "exercise-1",
              set_order: 1,
              weight: 50,
              reps: 8,
            },
          ],
        }),
      })
    );

    expect(response.status).toBe(200);
    expect(batch).toHaveBeenCalledTimes(2);
    expect(batch.mock.calls[0][0]).toHaveLength(2);
    await expect(response.json()).resolves.toEqual({
      ...workoutRow,
      skippedLogs: 0,
    });
  });
});
