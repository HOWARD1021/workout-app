import type { Exercise } from "@/lib/api";
import type { ExerciseBlock } from "@/contexts/WorkoutContext";

export interface WorkoutLogInput {
  exercise_id: string;
  set_order: number;
  weight: number | null;
  reps: number | null;
  note?: string;
}

export function resolveExerciseForSave(
  exercise: ExerciseBlock["exercise"],
  catalog: Exercise[]
): Exercise | null {
  if (exercise.id) {
    if (catalog.length === 0) {
      return exercise;
    }

    const inCatalog = catalog.find((item) => item.id === exercise.id);
    if (inCatalog) return inCatalog;
  }

  const byName = catalog.find(
    (item) =>
      item.name === exercise.name ||
      (exercise.nameZh && item.nameZh === exercise.nameZh)
  );

  return byName ?? null;
}

export function buildWorkoutLogs(
  exerciseBlocks: ExerciseBlock[],
  catalog: Exercise[]
): WorkoutLogInput[] {
  const logs: WorkoutLogInput[] = [];

  exerciseBlocks.forEach((block) => {
    const resolvedExercise = resolveExerciseForSave(block.exercise, catalog);
    if (!resolvedExercise?.id) return;

    block.sets.forEach((set) => {
      if (!set.completed) return;

      const setNote = [block.note, set.note].filter(Boolean).join(" | ");
      logs.push({
        exercise_id: resolvedExercise.id,
        set_order: set.set_order,
        weight: set.weight,
        reps: set.reps,
        note: setNote || undefined,
      });
    });
  });

  return logs;
}

export function rehydrateExerciseBlocks(
  blocks: ExerciseBlock[],
  catalog: Exercise[]
): ExerciseBlock[] {
  return blocks.map((block) => {
    const resolvedExercise = resolveExerciseForSave(block.exercise, catalog);
    if (!resolvedExercise || resolvedExercise.id === block.exercise.id) {
      return block;
    }

    return {
      ...block,
      exercise: resolvedExercise,
    };
  });
}

export function getWorkoutSaveErrorMessage(error: unknown): string {
  if (error && typeof error === "object" && "status" in error) {
    const status = Number((error as { status: number }).status);
    const message =
      "message" in error && typeof (error as { message: unknown }).message === "string"
        ? (error as { message: string }).message
        : null;

    if (status === 401) {
      return "登入已過期，請重新登入後再儲存。";
    }
    if (status === 400) {
      return message || "訓練資料有誤，請重新選擇動作後再試。";
    }
    if (status >= 500) {
      return "伺服器暫時無法儲存，請稍後再試。";
    }
    if (message) return message;
  }

  if (error instanceof DOMException && error.name === "AbortError") {
    return "儲存逾時，請再試一次。";
  }

  return "儲存訓練失敗，請檢查連線後再試一次。";
}
