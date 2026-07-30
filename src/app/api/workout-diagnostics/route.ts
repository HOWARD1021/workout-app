import { getCloudflareContext } from "@opennextjs/cloudflare";
import { getDb, workoutSaveEvents } from "@/lib/db";
import { getCurrentUser } from "@/lib/auth";
import { getWorkoutReleaseVersion } from "@/lib/workout-observability";
import { NextResponse } from "next/server";

const MAX_EVENTS_PER_REQUEST = 10;
const MAX_EVENT_AGE_MS = 30 * 24 * 60 * 60 * 1000;

type ClientDiagnostic = {
  id: string;
  requestId?: string;
  errorReference?: string;
  submissionId?: string;
  code?: string;
  httpStatus?: number;
  releaseVersion?: string;
  occurredAt?: string;
  category?: string;
};

async function getAuthenticatedUser(request: Request) {
  try {
    return await getCurrentUser(request);
  } catch {
    return null;
  }
}

function boundedString(value: unknown, maxLength: number): string | null {
  if (typeof value !== "string") return null;
  const normalized = value.trim();
  return normalized ? normalized.slice(0, maxLength) : null;
}

function sanitizeEvent(value: unknown, userId: string) {
  if (!value || typeof value !== "object") return null;
  const event = value as Partial<ClientDiagnostic>;
  const id = boundedString(event.id, 120);
  if (!id || !/^client-[a-zA-Z0-9._:-]+$/.test(id)) return null;

  const occurredAt = boundedString(event.occurredAt, 40);
  const occurredTime = occurredAt ? Date.parse(occurredAt) : NaN;
  const safeOccurredAt =
    Number.isFinite(occurredTime) &&
    occurredTime <= Date.now() &&
    Date.now() - occurredTime <= MAX_EVENT_AGE_MS
      ? new Date(occurredTime).toISOString()
      : new Date().toISOString();
  const code = boundedString(event.code, 60);

  return {
    id,
    errorReference: boundedString(event.errorReference, 120) || id,
    requestId: boundedString(event.requestId, 100) || id,
    submissionId: boundedString(event.submissionId, 120),
    userId,
    operation: "workout_save",
    status: "error",
    errorCode: code && /^[A-Z0-9_.:-]+$/.test(code) ? code : "CLIENT_DIAGNOSTIC",
    httpStatus:
      typeof event.httpStatus === "number"
        ? Math.max(0, Math.min(599, Math.trunc(event.httpStatus)))
        : 0,
    releaseVersion:
      boundedString(event.releaseVersion, 80) ||
      getWorkoutReleaseVersion(getCloudflareVersion()),
    context: JSON.stringify({
      source: "client_queue",
      category: boundedString(event.category, 30) || "unknown",
    }),
    createdAt: safeOccurredAt,
  };
}

function getCloudflareVersion(): string | undefined {
  try {
    const { env } = getCloudflareContext();
    return env.WORKOUT_APP_VERSION;
  } catch {
    return undefined;
  }
}

export async function POST(request: Request) {
  const user = await getAuthenticatedUser(request);
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const body = (await request.json()) as { events?: unknown };
    if (!Array.isArray(body.events)) {
      return NextResponse.json(
        { error: "Invalid diagnostic payload", code: "INVALID_DIAGNOSTIC_PAYLOAD" },
        { status: 400 }
      );
    }

    const events = body.events
      .slice(0, MAX_EVENTS_PER_REQUEST)
      .map((event) => sanitizeEvent(event, user.id))
      .filter((event): event is NonNullable<typeof event> => event !== null);

    if (events.length === 0) {
      return NextResponse.json({ accepted: 0 }, { status: 202 });
    }

    const { env } = getCloudflareContext();
    const db = getDb(env.DB);
    const inserts = events.map((event) => {
      const insert = db.insert(workoutSaveEvents).values(event);
      const onConflictDoNothing = (
        insert as unknown as { onConflictDoNothing?: () => unknown }
      ).onConflictDoNothing;
      return onConflictDoNothing ? onConflictDoNothing.call(insert) : insert;
    });
    await db.batch(
      inserts as unknown as Parameters<typeof db.batch>[0]
    );

    return NextResponse.json(
      { accepted: events.length },
      {
        status: 202,
        headers: {
          "x-workout-release-version": getWorkoutReleaseVersion(
            getCloudflareVersion()
          ),
        },
      }
    );
  } catch {
    return NextResponse.json(
      { error: "Unable to accept diagnostics", code: "DIAGNOSTIC_WRITE_FAILED" },
      { status: 503 }
    );
  }
}
