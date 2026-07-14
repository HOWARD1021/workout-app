import { readFile } from "node:fs/promises";
import path from "node:path";
import { pathToFileURL } from "node:url";
import {
  generateExerciseUpdateSql,
  mapExercisesToDataset,
  type DatasetExerciseForMapping,
} from "../src/lib/exercise-dataset-mapping";

export const DATASET_URL =
  "https://raw.githubusercontent.com/hasaneyldrm/exercises-dataset/main/data/exercises.json";
export const DEFAULT_R2_PUBLIC_BASE_URL =
  "https://pub-ede481040d4c45818baf14bfb47b2b2d.r2.dev/gifs";
const ROOT = process.cwd();
const SEED_FILES = [
  "drizzle/seed.sql",
  "drizzle/0006_more_exercises.sql",
  "drizzle/0007_zoro_chest_template.sql",
];
const EXISTING_I18N_SQL = "drizzle/0008_exercise_i18n_images.sql";
const CHINESE_NAME_OVERRIDES: Record<string, string> = {
  "15° Cable Fly (Narrow)": "15度窄距繩索飛鳥",
  "30° Incline Dumbbell Press": "30度上斜啞鈴推舉",
  "45° Incline Dumbbell Press": "45度上斜啞鈴推舉",
  Dip: "雙槓撐體",
  "High Cable Fly (Downward)": "高位繩索下斜飛鳥",
  "Smith Machine Bench Press": "史密斯機臥推",
};
export const MANUAL_MATCHES: Record<string, string> = {
  "Bench Press": "barbell bench press",
  "Incline Bench Press": "barbell incline bench press",
  "Push Up": "push-up",
  "Decline Bench Press": "barbell decline bench press",
  "Chest Press Machine": "lever chest press",
  "15° Cable Fly (Narrow)": "cable low fly",
  "Cable Crossover": "cable upper chest crossovers",
  "30° Incline Dumbbell Press": "dumbbell incline bench press",
  "45° Incline Dumbbell Press": "dumbbell incline bench press",
  Dip: "chest dip",
  "High Cable Fly (Downward)": "cable decline fly",
  "Incline Dumbbell Fly": "dumbbell incline fly",
  "Smith Machine Bench Press": "smith bench press",
  Deadlift: "barbell deadlift",
  "Pull Up": "pull-up",
  "Lat Pulldown": "cable lat pulldown full range of motion",
  "Barbell Row": "barbell bent over row",
  "Seated Cable Row": "cable seated row",
  "Single Arm Dumbbell Row": "dumbbell bent over row",
  "Reverse Fly": "dumbbell reverse fly",
  "Straight Arm Pulldown": "cable straight arm pulldown",
  "Meadows Row": "barbell one arm bent over row",
  "T-Bar Row": "lever t bar row",
  Squat: "barbell full squat",
  "Leg Press": "sled 45в° leg press",
  "Romanian Deadlift": "barbell romanian deadlift",
  "Leg Curl": "lever lying leg curl",
  "Leg Extension": "lever leg extension",
  "Calf Raise": "barbell standing calf raise",
  "Hack Squat": "sled hack squat",
  "Goblet Squat": "dumbbell goblet squat",
  "Sumo Deadlift": "barbell sumo deadlift",
  "Glute Kickback": "cable kickback",
  "Step Up": "dumbbell step-up",
  "Seated Calf Raise": "lever seated calf raise",
  "Leg Press (45°)": "sled 45в° leg press",
  "Good Morning": "barbell good morning",
  "Overhead Press": "barbell seated overhead press",
  "Lateral Raise": "dumbbell lateral raise",
  "Front Raise": "dumbbell front raise",
  "Arnold Press": "dumbbell arnold press",
  "Reverse Pec Deck": "lever reverse t-bar row",
  "Upright Row": "barbell upright row",
  "Rear Delt Raise": "dumbbell rear lateral raise",
  "Dumbbell Overhead Press": "dumbbell standing overhead press",
  "Bicep Curl": "dumbbell biceps curl",
  "Tricep Pushdown": "cable pushdown",
  "Hammer Curl": "dumbbell hammer curl",
  "Skull Crusher": "barbell lying triceps extension skull crusher",
  "Preacher Curl": "barbell preacher curl",
  "Concentration Curl": "dumbbell concentration curl",
  "Overhead Tricep Extension": "barbell standing overhead triceps extension",
  "Tricep Dip": "triceps dip",
  "Reverse Grip Curl": "barbell reverse curl",
  "Diamond Push Up": "diamond push-up",
  "Close Grip Bench Press": "barbell close-grip bench press",
  "Rope Pushdown": "cable pushdown (with rope attachment)",
  "EZ Bar Curl": "ez barbell curl",
  Plank: "weighted front plank",
  Crunch: "crunch floor",
  "Leg Raise": "lying leg-hip raise",
  "Ab Wheel Rollout": "wheel rollerout",
  "Cable Crunch": "cable kneeling crunch",
  "Side Plank": "side plank hip adduction",
  "Bicycle Crunch": "band bicycle crunch",
  Running: "run",
  Cycling: "stationary bike walk",
  "Stair Climber": "standing calf raise (on a staircase)",
  Elliptical: "walk elliptical cross trainer",
  "Battle Rope": "battling ropes",
  Swimming: "swimmer kicks v. 2 (male)",
  "Treadmill Walk": "walking on incline treadmill",
  "Yoga Flow": "butterfly yoga pose",
  "Hip Flexor Stretch": "intermediate hip flexor and quad stretch",
};

export async function buildExerciseMapping(
  mediaBaseUrl = process.env.MEDIA_BASE_URL ?? DEFAULT_R2_PUBLIC_BASE_URL
) {
  const [appExerciseNames, chineseNames, datasetExercises] = await Promise.all([
    readBuiltInExerciseNames(),
    readChineseNames(),
    fetchDatasetExercises(),
  ]);
  const result = mapExercisesToDataset(
    appExerciseNames.map((name) => ({ name })),
    datasetExercises,
    {
      chineseNames,
      manualMatches: MANUAL_MATCHES,
      mediaBaseUrl,
    }
  );

  return result;
}

async function main() {
  const result = await buildExerciseMapping();
  console.error(
    [
      `total=${result.summary.total}`,
      `direct=${result.summary.direct}`,
      `manual=${result.summary.manual}`,
      `unmatched=${result.summary.unmatched}`,
    ].join(" ")
  );
  console.log(generateExerciseUpdateSql(result.rows));
}

export async function readBuiltInExerciseNames() {
  const names = new Set<string>();

  for (const file of SEED_FILES) {
    const sql = await readFile(path.join(ROOT, file), "utf8");
    for (const statement of sql.matchAll(/INSERT(?:\s+OR\s+IGNORE)?\s+INTO\s+exercises[\s\S]*?;/gi)) {
      for (const match of statement[0].matchAll(/\(\s*'[^']+'\s*,\s*'((?:''|[^'])+)'/g)) {
        names.add(match[1].replace(/''/g, "'"));
      }
    }
  }

  return [...names].sort((a, b) => a.localeCompare(b));
}

export async function readChineseNames() {
  try {
    const sql = await readFile(path.join(ROOT, EXISTING_I18N_SQL), "utf8");
    return {
      ...Object.fromEntries(
      [...sql.matchAll(/SET name_zh = '((?:''|[^'])*)'.*? WHERE name = '((?:''|[^'])+)'/g)].map(
        (match) => [match[2].replace(/''/g, "'"), match[1].replace(/''/g, "'")]
      )
      ),
      ...CHINESE_NAME_OVERRIDES,
    };
  } catch {
    return CHINESE_NAME_OVERRIDES;
  }
}

export async function fetchDatasetExercises(): Promise<DatasetExerciseForMapping[]> {
  const response = await fetch(process.env.DATASET_URL ?? DATASET_URL);
  if (!response.ok) {
    throw new Error(`Failed to fetch dataset: ${response.status}`);
  }

  const rows = (await response.json()) as DatasetExerciseForMapping[];
  return rows.map((row) => ({
    id: row.id,
    name: row.name,
    media_id: row.media_id,
  }));
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });
}
