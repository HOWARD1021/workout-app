import { beforeEach, describe, expect, it, vi } from "vitest";

const state = {
  workout: null as Record<string, unknown> | null,
  events: [] as Array<Record<string, unknown>>,
  rejectWorkoutBatch: false,
};

const workoutTable = { id: "workouts.id", userId: "workouts.user_id" };

const tables = {
  exercises: "exercises",
  workoutTemplates: "workout_templates",
  workouts: workoutTable,
  workoutLogs: "workout_logs",
  workoutSaveEvents: "workout_save_events",
};

const batch = vi.fn(async (queries: Array<{ table?: unknown; values?: unknown }>) => {
  const hasWorkoutWrite = queries.some(
    (query) => query.table === tables.workouts || query.table === tables.workoutLogs
  );

  if (hasWorkoutWrite && state.rejectWorkoutBatch) {
    throw new Error("D1 unavailable: secret note should never escape");
  }

  for (const query of queries) {
    if (query.table === tables.workouts) {
      state.workout = query.values as Record<string, unknown>;
    }
    if (query.table === tables.workoutSaveEvents) {
      state.events.push(query.values as Record<string, unknown>);
    }
  }

  return queries.map(() => ({ success: true }));
});

vi.mock("@/lib/auth", () => ({
  getCurrentUser: vi.fn(async () => ({ id: "user-1", email: "user@example.com" })),
}));

vi.mock("@opennextjs/cloudflare", () => ({
  getCloudflareContext: vi.fn(() => ({ env: { DB: {} } })),
}));

vi.mock("@/lib/db", () => {
  type QueryChain = {
    from: (table: unknown) => QueryChain;
    where: () => QueryChain | Promise<unknown[]>;
    orderBy: () => QueryChain;
    limit: () => Promise<unknown[]>;
  };

  const makeChain = (selection?: Record<string, unknown>) => {
    const chain = {} as QueryChain;
    let selectedTable: unknown;
    chain.from = (table) => {
      selectedTable = table;
      return chain;
    };
    chain.orderBy = () => chain;
    chain.where =
      selection?.id === "exercises.id"
        ? async () => [{ id: "exercise-1" }]
        : () => chain;
    chain.limit = async () => {
      if (selectedTable === tables.workoutSaveEvents) return state.events;
      if (selection?.id === "workout_templates.id") return [];
      return state.workout ? [state.workout] : [];
    };
    return chain;
  };

  return {
    getDb: () => ({
      select: vi.fn((selection?: Record<string, unknown>) => makeChain(selection)),
      insert: vi.fn((table: string) => ({
        values: vi.fn((values: unknown) => ({ table, values })),
      })),
      batch,
    }),
    exercises: { id: "exercises.id", deletedAt: "exercises.deleted_at" },
    workoutTemplates: { id: "workout_templates.id", deletedAt: "workout_templates.deleted_at" },
    workouts: workoutTable,
    workoutLogs: tables.workoutLogs,
    workoutSaveEvents: tables.workoutSaveEvents,
  };
});

function request(body: Record<string, unknown>) {
  return new Request("https://example.com/api/workouts", {
    method: "POST",
    headers: { "x-request-id": "request-test-1" },
    body: JSON.stringify(body),
  });
}

const payload = {
  id: "submission-1",
  started_at: "2026-07-26T10:00:00.000Z",
  ended_at: "2026-07-26T11:00:00.000Z",
  note: "private workout note",
  logs: [
    {
      exercise_id: "exercise-1",
      set_order: 1,
      weight: 50,
      reps: 8,
      note: "private set note",
    },
  ],
};

describe("workout save observability API", () => {
  beforeEach(() => {
    state.workout = null;
    state.events = [];
    state.rejectWorkoutBatch = false;
    delete process.env.WORKOUT_MAINTAINER_USER_IDS;
    batch.mockClear();
    vi.spyOn(console, "error").mockImplementation(() => {});
    vi.spyOn(console, "info").mockImplementation(() => {});
  });

  it("records a sanitized successful attempt and identifies a replay", async () => {
    const { POST } = await import("@/app/api/workouts/route");

    const first = await POST(request(payload));
    const replay = await POST(request(payload));

    expect(first.status).toBe(200);
    expect(replay.status).toBe(200);
    await expect(replay.json()).resolves.toEqual(
      expect.objectContaining({ replayed: true, skippedLogs: 0 })
    );
    expect(state.events).toHaveLength(2);
    expect(state.events).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          operation: "workout_save",
          status: "success",
          requestId: "request-test-1",
          submissionId: "submission-1",
        }),
      ])
    );
    const serialized = JSON.stringify(state.events.map((event) => event.context));
    expect(serialized).not.toContain("private workout note");
    expect(serialized).not.toContain("private set note");
    expect(serialized).not.toContain("50");
  });

  it("returns a safe reference when the D1 batch is rejected", async () => {
    state.rejectWorkoutBatch = true;
    const { POST } = await import("@/app/api/workouts/route");

    const response = await POST(request(payload));
    const body = await response.json();

    expect(response.status).toBe(500);
    expect(body).toEqual(
      expect.objectContaining({
        code: "D1_WRITE_FAILED",
        errorReference: expect.stringMatching(/^save-/),
      })
    );
    expect(JSON.stringify(body)).not.toContain("D1 unavailable");
    expect(state.events).toEqual([
      expect.objectContaining({
        status: "error",
        errorCode: "D1_WRITE_FAILED",
        submissionId: "submission-1",
      }),
    ]);
  });

  it("classifies malformed save payloads as validation failures", async () => {
    const { POST } = await import("@/app/api/workouts/route");
    const response = await POST(
      request({
        ...payload,
        logs: [null],
      })
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({ code: "INVALID_WORKOUT_PAYLOAD" })
    );
    expect(state.events).toEqual([
      expect.objectContaining({
        errorCode: "INVALID_WORKOUT_PAYLOAD",
        context: expect.stringContaining('"failureStage":"validation"'),
      }),
    ]);
  });

  it("rejects a submission owned by another user without exposing it", async () => {
    state.workout = {
      id: "submission-1",
      userId: "other-user",
      startedAt: "2026-07-25T10:00:00.000Z",
      note: "other user's private note",
    };
    const { POST } = await import("@/app/api/workouts/route");

    const response = await POST(request(payload));
    const body = await response.json();

    expect(response.status).toBe(409);
    expect(body).toEqual(
      expect.objectContaining({
        code: "SUBMISSION_CONFLICT",
        errorReference: expect.stringMatching(/^save-/),
      })
    );
    expect(JSON.stringify(body)).not.toContain("other-user");
    expect(JSON.stringify(body)).not.toContain("other user's private note");
  });

  it("accepts only sanitized client diagnostics", async () => {
    const { POST } = await import("@/app/api/workout-diagnostics/route");

    const response = await POST(
      new Request("https://example.com/api/workout-diagnostics", {
        method: "POST",
        body: JSON.stringify({
          events: [
            {
              id: "client-diagnostic-1",
              code: "D1_WRITE_FAILED",
              errorReference: "save-123",
              submissionId: "submission-1",
              category: "api",
              occurredAt: "2026-07-26T10:00:00.000Z",
              raw: "exercise name, weight, token",
            },
          ],
        }),
      })
    );

    expect(response.status).toBe(202);
    expect(await response.json()).toEqual({ accepted: 1 });
    const event = state.events.at(-1);
    expect(event).toEqual(
      expect.objectContaining({
        userId: "user-1",
        errorCode: "D1_WRITE_FAILED",
        submissionId: "submission-1",
      })
    );
    expect(JSON.stringify(event)).not.toContain("exercise name");
    expect(JSON.stringify(event)).not.toContain("token");
  });

  it("allows an explicitly configured maintainer to query bounded events", async () => {
    process.env.WORKOUT_MAINTAINER_USER_IDS = "user-1";
    state.events = [
      {
        id: "event-1",
        errorReference: "save-123",
        releaseVersion: "dev",
      },
    ];
    const { GET } = await import(
      "@/app/api/maintainer/workout-save-events/route"
    );

    const response = await GET(
      new Request(
        "https://example.com/api/maintainer/workout-save-events?error_reference=save-123&limit=1"
      )
    );

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        events: state.events,
        retentionDays: 30,
      })
    );
  });
});
