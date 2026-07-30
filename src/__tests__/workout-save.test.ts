import { beforeEach, describe, expect, it, vi } from "vitest";
import {
  buildWorkoutLogs,
  getWorkoutSaveErrorMessage,
  rehydrateExerciseBlocks,
  resolveExerciseForSave,
} from "@/lib/workout-save";
import type { ExerciseBlock } from "@/contexts/WorkoutContext";
import { ApiError, fetchApi } from "@/lib/api";
import {
  enqueueWorkoutDiagnostic,
  flushWorkoutDiagnostics,
} from "@/lib/workout-diagnostics";

const catalog = [
  {
    id: "exercise-1",
    name: "Bench Press",
    nameZh: "臥推",
    type: "Strength",
    muscleGroup: "Chest",
    imageUrl: null,
    gifUrl: null,
    isCustom: false,
    createdAt: null,
    deletedAt: null,
  },
];

const block: ExerciseBlock = {
  id: "block-1",
  exercise: {
    id: "stale-id",
    name: "Bench Press",
    nameZh: "臥推",
    type: "Strength",
    muscleGroup: "Chest",
    imageUrl: null,
    gifUrl: null,
    isCustom: false,
    createdAt: null,
    deletedAt: null,
  },
  sets: [
    { set_order: 1, weight: 80, reps: 8, completed: true },
    { set_order: 2, weight: 75, reps: 10, completed: false },
  ],
};

describe("workout save helpers", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    vi.unstubAllGlobals();

    const storage = new Map<string, string>();
    Object.defineProperty(window, "localStorage", {
      configurable: true,
      value: {
        getItem: (key: string) => storage.get(key) ?? null,
        setItem: (key: string, value: string) => {
          storage.set(key, value);
        },
        removeItem: (key: string) => {
          storage.delete(key);
        },
        clear: () => {
          storage.clear();
        },
      },
    });
  });

  it("resolves exercises by catalog id or name", () => {
    expect(resolveExerciseForSave(block.exercise, catalog)?.id).toBe("exercise-1");
    expect(
      resolveExerciseForSave(
        { ...block.exercise, id: "exercise-1", nameZh: null },
        catalog
      )?.id
    ).toBe("exercise-1");
  });

  it("keeps session exercise ids before the catalog loads", () => {
    expect(resolveExerciseForSave(block.exercise, [])?.id).toBe("stale-id");
  });

  it("builds logs only for completed sets with resolved exercise ids", () => {
    expect(buildWorkoutLogs([block], catalog)).toEqual([
      {
        exercise_id: "exercise-1",
        set_order: 1,
        weight: 80,
        reps: 8,
        note: undefined,
      },
    ]);
  });

  it("rehydrates stale exercise ids from the catalog", () => {
    const [next] = rehydrateExerciseBlocks([block], catalog);
    expect(next.exercise.id).toBe("exercise-1");
  });

  it("maps API errors to user-facing save messages", () => {
    expect(getWorkoutSaveErrorMessage(new ApiError(401, "Unauthorized"))).toBe(
      "登入已過期，請重新登入後再儲存。"
    );
    expect(
      getWorkoutSaveErrorMessage(
        new ApiError(400, "找不到已完成的動作資料，請重新整理頁面後再儲存一次。")
      )
    ).toBe("找不到已完成的動作資料，請重新整理頁面後再儲存一次。");
    expect(getWorkoutSaveErrorMessage(new ApiError(500, "Failed"))).toBe(
      "伺服器暫時無法儲存，請稍後再試。"
    );
  });

  it("captures typed API error metadata from safe error payloads", async () => {
    vi.stubGlobal(
      "fetch",
      vi.fn().mockResolvedValue(
        new Response(
          JSON.stringify({
            error: "Request failed",
            code: "D1_WRITE_FAILED",
            errorReference: "save-123",
            releaseVersion: "2026.07.26",
          }),
          {
            status: 500,
            headers: {
              "Content-Type": "application/json",
              "x-request-id": "request-123",
            },
          }
        )
      )
    );

    await expect(fetchApi("/workouts", { method: "POST" })).rejects.toMatchObject({
      status: 500,
      message: "Request failed",
      code: "D1_WRITE_FAILED",
      errorReference: "save-123",
      requestId: "request-123",
      releaseVersion: "2026.07.26",
    });
  });

  it("includes the server reference in mapped save errors", () => {
    expect(
      getWorkoutSaveErrorMessage(
        new ApiError(503, "Failed", {
          errorReference: "save-123",
        })
      )
    ).toBe("伺服器暫時無法儲存，請稍後再試。（參考編號：save-123）");
  });

  it("includes the release version when the server provides one", () => {
    expect(
      getWorkoutSaveErrorMessage(
        new ApiError(503, "Failed", {
          errorReference: "save-123",
          releaseVersion: "release-42",
        })
      )
    ).toBe(
      "伺服器暫時無法儲存，請稍後再試。（參考編號：save-123，版本：release-42）"
    );
  });

  it("queues sanitized workout diagnostics without storing raw workout details", () => {
    getWorkoutSaveErrorMessage(
      new ApiError(400, "Bench Press 80kg private note token=secret", {
        code: "VALIDATION_FAILED",
        errorReference: "save-456",
        requestId: "request-456",
        releaseVersion: "2026.07.26",
      })
    );

    const queued = window.localStorage.getItem("workout-diagnostics-queue");
    expect(queued).toContain("VALIDATION_FAILED");
    expect(queued).toContain("save-456");
    expect(queued).not.toContain("Bench Press");
    expect(queued).not.toContain("80kg");
    expect(queued).not.toContain("private note");
    expect(queued).not.toContain("token=secret");
  });

  it("bounds and flushes the queued diagnostics batch", async () => {
    for (let index = 0; index < 23; index += 1) {
      enqueueWorkoutDiagnostic({
        category: "api",
        httpStatus: 500,
        code: `ERR_${index}`,
        errorReference: `save-${index}`,
      });
    }

    const beforeFlush = JSON.parse(
      window.localStorage.getItem("workout-diagnostics-queue") ?? "[]"
    ) as Array<{ code?: string }>;

    expect(beforeFlush).toHaveLength(20);
    expect(beforeFlush[0]?.code).toBe("ERR_3");

    const fetchMock = vi.fn().mockResolvedValue(new Response(null, { status: 202 }));

    await expect(
      flushWorkoutDiagnostics({ fetchImpl: fetchMock as typeof fetch })
    ).resolves.toEqual({
      sent: 10,
      remaining: 10,
    });

    expect(fetchMock).toHaveBeenCalledWith(
      "/api/workout-diagnostics",
      expect.objectContaining({
        method: "POST",
        credentials: "include",
      })
    );

    const requestBody = JSON.parse(fetchMock.mock.calls[0]?.[1]?.body as string) as {
      events: Array<{ code?: string }>;
    };
    expect(requestBody.events).toHaveLength(10);
    expect(requestBody.events[0]?.code).toBe("ERR_3");

    const afterFlush = JSON.parse(
      window.localStorage.getItem("workout-diagnostics-queue") ?? "[]"
    ) as Array<{ code?: string }>;
    expect(afterFlush).toHaveLength(10);
    expect(afterFlush[0]?.code).toBe("ERR_13");
  });
});
