import { execFileSync } from "node:child_process";
import { mkdir, writeFile } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import {
  generateExerciseUpdateSql,
  type ExerciseMappingRow,
} from "../src/lib/exercise-dataset-mapping";
import { buildExerciseMapping } from "./map-exercises";

const SOURCE_MEDIA_BASE_URL = "https://static.exercisedb.dev/media";
const DEFAULT_BUCKET = "workout-exercise-media";
const DEFAULT_PUBLIC_BASE_URL =
  "https://pub-ede481040d4c45818baf14bfb47b2b2d.r2.dev";

async function main() {
  const bucket = process.env.R2_BUCKET ?? DEFAULT_BUCKET;
  const publicBaseUrl = stripTrailingSlash(
    process.env.R2_PUBLIC_BASE_URL ?? DEFAULT_PUBLIC_BASE_URL
  );
  const sqlFile = process.env.SQL_FILE;
  const dryRun = process.env.DRY_RUN === "1";
  const tempDir = path.join(os.tmpdir(), "workout-exercise-media-r2");

  await mkdir(tempDir, { recursive: true });

  const sourceMapping = await buildExerciseMapping(SOURCE_MEDIA_BASE_URL);
  const rowsWithMedia = sourceMapping.rows.filter((row) => row.gifUrl);
  const outputRows: ExerciseMappingRow[] = [];

  console.error(
    `media rows=${rowsWithMedia.length} missing=${sourceMapping.rows.length - rowsWithMedia.length}`
  );

  for (const row of sourceMapping.rows) {
    if (!row.gifUrl) {
      outputRows.push(row);
      continue;
    }

    const mediaId = mediaIdFromUrl(row.gifUrl);
    const key = `gifs/${mediaId}.gif`;
    const publicUrl = `${publicBaseUrl}/${key}`;

    if (!dryRun) {
      const filePath = path.join(tempDir, `${mediaId}.gif`);
      await download(row.gifUrl, filePath);
      execFileSync(
        "npx",
        [
          "wrangler",
          "r2",
          "object",
          "put",
          `${bucket}/${key}`,
          "--file",
          filePath,
          "--content-type",
          "image/gif",
          "--remote",
        ],
        { stdio: "pipe" }
      );
    }

    console.error(`${dryRun ? "plan" : "uploaded"} ${row.exerciseName} -> ${publicUrl}`);
    outputRows.push({
      ...row,
      imageUrl: publicUrl,
      gifUrl: publicUrl,
    });
  }

  const sql = [
    "-- Fix exercise media URLs to use Cloudflare R2-hosted GIF assets",
    "-- image_url intentionally points to the same GIF so exercise lists always have a visual preview.",
    "",
    generateExerciseUpdateSql(outputRows),
    "",
  ].join("\n");

  if (sqlFile) {
    await writeFile(sqlFile, sql);
    console.error(`wrote ${sqlFile}`);
  } else {
    console.log(sql);
  }
}

async function download(url: string, filePath: string) {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error(`Failed to download ${url}: ${response.status}`);
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await writeFile(filePath, bytes);
}

function mediaIdFromUrl(url: string) {
  const mediaId = url.match(/\/([^/.]+)\.gif$/)?.[1];
  if (!mediaId) {
    throw new Error(`Could not extract media id from ${url}`);
  }
  return mediaId;
}

function stripTrailingSlash(value: string) {
  return value.replace(/\/+$/, "");
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
