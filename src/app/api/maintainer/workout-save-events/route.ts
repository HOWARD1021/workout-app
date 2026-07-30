import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, workoutSaveEvents } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getWorkoutReleaseVersion, isMaintainer } from "@/lib/workout-observability";
import { and, desc, eq, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";

const RETENTION_DAYS = 30;
const MAX_LIMIT = 100;

function optionalDate(value: string | null): string | null | "invalid" {
  if (!value) return null;
  const time = Date.parse(value);
  return Number.isFinite(time) ? new Date(time).toISOString() : "invalid";
}

async function getAuthenticatedUser(request: Request) {
  try {
    return await getCurrentUser(request);
  } catch {
    return null;
  }
}

export async function GET(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const { env } = getCloudflareContext();
  if (!isMaintainer(user, env.WORKOUT_MAINTAINER_USER_IDS)) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const url = new URL(request.url);
  const from = optionalDate(url.searchParams.get("from"));
  const to = optionalDate(url.searchParams.get("to"));
  if (from === "invalid" || to === "invalid") {
    return NextResponse.json(
      { error: "Invalid time range", code: "INVALID_TIME_RANGE" },
      { status: 400 }
    );
  }

  const defaultFrom = new Date(
    Date.now() - RETENTION_DAYS * 24 * 60 * 60 * 1000
  ).toISOString();
  const conditions = [
    gte(workoutSaveEvents.createdAt, from || defaultFrom),
  ];
  const errorReference = url.searchParams.get("error_reference");
  const submissionId = url.searchParams.get("submission_id");
  const releaseVersion = url.searchParams.get("release_version");
  if (errorReference) conditions.push(eq(workoutSaveEvents.errorReference, errorReference));
  if (submissionId) conditions.push(eq(workoutSaveEvents.submissionId, submissionId));
  if (releaseVersion) conditions.push(eq(workoutSaveEvents.releaseVersion, releaseVersion));
  if (to) conditions.push(lte(workoutSaveEvents.createdAt, to));

  const rawLimit = Number(url.searchParams.get("limit") || 50);
  const limit = Number.isFinite(rawLimit)
    ? Math.max(1, Math.min(MAX_LIMIT, Math.trunc(rawLimit)))
    : 50;

  try {
    const db = getDb(env.DB);
    const events = await db
      .select()
      .from(workoutSaveEvents)
      .where(and(...conditions))
      .orderBy(desc(workoutSaveEvents.createdAt))
      .limit(limit);

    return NextResponse.json(
      {
        events,
        retentionDays: RETENTION_DAYS,
        releaseVersion: getWorkoutReleaseVersion(env.WORKOUT_APP_VERSION),
      },
      {
        headers: {
          "x-workout-release-version": getWorkoutReleaseVersion(
            env.WORKOUT_APP_VERSION
          ),
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to read save diagnostics", code: "DIAGNOSTIC_READ_FAILED" },
      { status: 503 }
    );
  }
}
