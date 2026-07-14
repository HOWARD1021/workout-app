import { describe, expect, it } from "vitest";
import {
  buildWorkoutLogs,
  getWorkoutSaveErrorMessage,
  rehydrateExerciseBlocks,
  resolveExerciseForSave,
} from "@/lib/workout-save";
import type { ExerciseBlock } from "@/contexts/WorkoutContext";
import { ApiError } from "@/lib/api";

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
});
