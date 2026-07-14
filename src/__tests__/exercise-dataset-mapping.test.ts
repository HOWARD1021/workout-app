import { describe, expect, it } from "vitest";
import {
  generateExerciseUpdateSql,
  mapExercisesToDataset,
} from "@/lib/exercise-dataset-mapping";

describe("exercise dataset mapping", () => {
  it("matches app exercises to dataset media and keeps unmatched exercises reviewable", () => {
    const result = mapExercisesToDataset(
      [
        { name: "Bench Press" },
        { name: "Cable Crossover" },
        { name: "Unmatched Movement" },
      ],
      [
        { id: "0025", name: "bench press", media_id: "EIeI8Vf" },
        { id: "0227", name: "cable standing fly", media_id: "AbCd123" },
      ],
      {
        chineseNames: {
          "Bench Press": "槓鈴臥推",
          "Cable Crossover": "繩索夾胸",
          "Unmatched Movement": "未匹配動作",
        },
        manualMatches: {
          "Cable Crossover": "cable standing fly",
        },
      }
    );

    expect(result.summary).toEqual({
      total: 3,
      direct: 1,
      manual: 1,
      unmatched: 1,
    });
    expect(result.rows).toEqual([
      expect.objectContaining({
        exerciseName: "Bench Press",
        datasetName: "bench press",
        matchType: "direct",
        nameZh: "槓鈴臥推",
        imageUrl: "https://static.exercisedb.dev/media/EIeI8Vf.gif",
        gifUrl: "https://static.exercisedb.dev/media/EIeI8Vf.gif",
      }),
      expect.objectContaining({
        exerciseName: "Cable Crossover",
        datasetName: "cable standing fly",
        matchType: "manual",
        nameZh: "繩索夾胸",
        imageUrl: "https://static.exercisedb.dev/media/AbCd123.gif",
        gifUrl: "https://static.exercisedb.dev/media/AbCd123.gif",
      }),
      expect.objectContaining({
        exerciseName: "Unmatched Movement",
        datasetName: null,
        matchType: "unmatched",
        nameZh: "未匹配動作",
        imageUrl: null,
        gifUrl: null,
      }),
    ]);

    expect(generateExerciseUpdateSql(result.rows)).toContain(
      "UPDATE exercises SET name_zh = '槓鈴臥推', image_url = 'https://static.exercisedb.dev/media/EIeI8Vf.gif', gif_url = 'https://static.exercisedb.dev/media/EIeI8Vf.gif' WHERE name = 'Bench Press';"
    );
    expect(generateExerciseUpdateSql(result.rows)).toContain(
      "UPDATE exercises SET name_zh = '未匹配動作', image_url = NULL, gif_url = NULL WHERE name = 'Unmatched Movement';"
    );
  });
});
