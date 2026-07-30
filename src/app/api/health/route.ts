import { getWorkoutReleaseVersion } from "@/lib/workout-observability";
import { getCloudflareContext } from "@opennextjs/cloudflare";
import { NextResponse } from "next/server";

export async function GET() {
  const { env } = getCloudflareContext();
  const releaseVersion = getWorkoutReleaseVersion(env.WORKOUT_APP_VERSION);
  return NextResponse.json(
    { status: "ok", releaseVersion },
    { headers: { "x-workout-release-version": releaseVersion } }
  );
}
