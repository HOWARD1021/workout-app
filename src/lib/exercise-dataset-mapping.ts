const DEFAULT_MEDIA_BASE_URL = "https://static.exercisedb.dev/media";

export interface AppExerciseForMapping {
  name: string;
}

export interface DatasetExerciseForMapping {
  id: string;
  name: string;
  media_id?: string | null;
}

export interface ExerciseMappingOptions {
  chineseNames: Record<string, string>;
  manualMatches?: Record<string, string>;
  mediaBaseUrl?: string;
}

export interface ExerciseMappingRow {
  exerciseName: string;
  nameZh: string | null;
  datasetName: string | null;
  matchType: "direct" | "manual" | "unmatched";
  imageUrl: string | null;
  gifUrl: string | null;
}

export interface ExerciseMappingResult {
  rows: ExerciseMappingRow[];
  summary: {
    total: number;
    direct: number;
    manual: number;
    unmatched: number;
  };
}

export function normalizeExerciseName(name: string) {
  return name
    .toLowerCase()
    .replace(/&/g, " and ")
    .replace(/[^a-z0-9]+/g, " ")
    .trim()
    .replace(/\s+/g, " ");
}

export function mapExercisesToDataset(
  appExercises: AppExerciseForMapping[],
  datasetExercises: DatasetExerciseForMapping[],
  options: ExerciseMappingOptions
): ExerciseMappingResult {
  const mediaBaseUrl = options.mediaBaseUrl ?? DEFAULT_MEDIA_BASE_URL;
  const datasetByNormalizedName = new Map(
    datasetExercises.map((exercise) => [
      normalizeExerciseName(exercise.name),
      exercise,
    ])
  );

  const rows = appExercises.map((exercise): ExerciseMappingRow => {
    const manualMatchName = options.manualMatches?.[exercise.name];
    const datasetExercise = datasetByNormalizedName.get(
      normalizeExerciseName(manualMatchName ?? exercise.name)
    );
    const matchType = datasetExercise
      ? manualMatchName
        ? "manual"
        : "direct"
      : "unmatched";

    return {
      exerciseName: exercise.name,
      nameZh: options.chineseNames[exercise.name] ?? null,
      datasetName: datasetExercise?.name ?? null,
      matchType,
      imageUrl:
        datasetExercise && datasetExercise.media_id
          ? `${mediaBaseUrl}/${datasetExercise.media_id}.gif`
          : null,
      gifUrl:
        datasetExercise && datasetExercise.media_id
          ? `${mediaBaseUrl}/${datasetExercise.media_id}.gif`
          : null,
    };
  });

  return {
    rows,
    summary: {
      total: rows.length,
      direct: rows.filter((row) => row.matchType === "direct").length,
      manual: rows.filter((row) => row.matchType === "manual").length,
      unmatched: rows.filter((row) => row.matchType === "unmatched").length,
    },
  };
}

export function generateExerciseUpdateSql(rows: ExerciseMappingRow[]) {
  return rows
    .map((row) => {
      const nameZh = toSqlValue(row.nameZh);
      const imageUrl = toSqlValue(row.imageUrl);
      const gifUrl = toSqlValue(row.gifUrl);
      return `UPDATE exercises SET name_zh = ${nameZh}, image_url = ${imageUrl}, gif_url = ${gifUrl} WHERE name = ${toSqlValue(row.exerciseName)};`;
    })
    .join("\n");
}

function toSqlValue(value: string | null) {
  if (value === null) return "NULL";
  return `'${value.replace(/'/g, "''")}'`;
}
