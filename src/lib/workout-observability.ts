import type { DbClient } from "@/lib/db";
import { workoutSaveEvents } from "@/lib/db";

export const WORKOUT_SAVE_OPERATION = "workout_save";
export const WORKOUT_DIAGNOSTIC_QUEUE_LIMIT = 20;

export type WorkoutSaveErrorCode =
  | "AUTH_REQUIRED"
  | "INVALID_WORKOUT_PAYLOAD"
  | "NO_VALID_WORKOUT_LOGS"
  | "SUBMISSION_CONFLICT"
  | "D1_WRITE_FAILED"
  | "SAVE_FAILED";

export type WorkoutSaveAttemptStatus = "success" | "error";

export interface SaveRequestContext {
  requestId: string;
  errorReference: string;
  releaseVersion: string;
}

export interface SaveAttemptInput {
  context: SaveRequestContext;
  userId?: string | null;
  submissionId?: string | null;
  status: WorkoutSaveAttemptStatus;
  errorCode?: WorkoutSaveErrorCode | null;
  httpStatus: number;
  metadata?: {
    deduplicated?: boolean;
    failureStage?: string;
    logCount?: number;
    skippedLogs?: number;
  };
}

export function getWorkoutReleaseVersion(runtimeVersion?: string): string {
  return (
    runtimeVersion ||
    process.env.NEXT_PUBLIC_APP_VERSION ||
    process.env.WORKOUT_APP_VERSION ||
    "dev"
  ).slice(0, 80);
}

function createId(prefix: string): string {
  const uuid =
    typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
      ? crypto.randomUUID()
      : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `${prefix}-${uuid}`;
}

function sanitizeRequestId(value: string | null): string | null {
  if (!value) return null;
  const normalized = value.trim();
  return /^[a-zA-Z0-9._:-]{1,100}$/.test(normalized) ? normalized : null;
}

export function createSaveRequestContext(
  request: Request,
  runtimeVersion?: string
): SaveRequestContext {
  return {
    requestId:
      sanitizeRequestId(request.headers.get("x-request-id")) ||
      createId("req"),
    errorReference: createId("save"),
    releaseVersion: getWorkoutReleaseVersion(runtimeVersion),
  };
}

export function safeErrorMessage(code: WorkoutSaveErrorCode): string {
  switch (code) {
    case "AUTH_REQUIRED":
      return "登入已過期，請重新登入後再儲存。";
    case "INVALID_WORKOUT_PAYLOAD":
      return "訓練資料格式有誤，請重新整理頁面後再試。";
    case "NO_VALID_WORKOUT_LOGS":
      return "找不到已完成的動作資料，請重新整理頁面後再儲存一次。";
    case "SUBMISSION_CONFLICT":
      return "這筆訓練提交已屬於其他帳號，請重新整理後再試。";
    case "D1_WRITE_FAILED":
      return "伺服器暫時無法儲存，請稍後再試。";
    case "SAVE_FAILED":
      return "儲存訓練失敗，請稍後再試。";
  }
}

function buildDiagnosticContext(metadata: SaveAttemptInput["metadata"]): string {
  const safeMetadata = {
    deduplicated: metadata?.deduplicated === true,
    failureStage: metadata?.failureStage?.slice(0, 40) || undefined,
    logCount:
      typeof metadata?.logCount === "number"
        ? Math.max(0, Math.min(1000, Math.trunc(metadata.logCount)))
        : undefined,
    skippedLogs:
      typeof metadata?.skippedLogs === "number"
        ? Math.max(0, Math.min(1000, Math.trunc(metadata.skippedLogs)))
        : undefined,
  };

  return JSON.stringify(safeMetadata);
}

export function buildSaveAttempt(input: SaveAttemptInput) {
  return {
    id: createId("event"),
    errorReference: input.context.errorReference,
    requestId: input.context.requestId,
    submissionId: input.submissionId || null,
    userId: input.userId || null,
    operation: WORKOUT_SAVE_OPERATION,
    status: input.status,
    errorCode: input.errorCode || null,
    httpStatus: input.httpStatus,
    releaseVersion: input.context.releaseVersion,
    context: buildDiagnosticContext(input.metadata),
    createdAt: new Date().toISOString(),
  };
}

type BuiltSaveAttempt = ReturnType<typeof buildSaveAttempt>;

export async function persistSaveAttempt(
  db: DbClient,
  input: SaveAttemptInput,
  event = buildSaveAttempt(input)
): Promise<void> {
  await db.batch([db.insert(workoutSaveEvents).values(event)]);
}

export function emitSaveAttempt(
  input: SaveAttemptInput,
  event: BuiltSaveAttempt = buildSaveAttempt(input)
): void {
  const line = JSON.stringify({
    event: "workout_save_attempt",
    ...event,
  });

  if (input.status === "error") {
    console.error(line);
  } else {
    console.info(line);
  }
}

export async function recordSaveAttempt(
  db: DbClient | null,
  input: SaveAttemptInput
): Promise<void> {
  const event = buildSaveAttempt(input);
  emitSaveAttempt(input, event);

  if (!db) return;

  try {
    await persistSaveAttempt(db, input, event);
  } catch {
    // D1 may be the failing dependency. Keep the structured Worker log as
    // the durable fallback and never turn diagnostic persistence into a
    // second user-visible save failure.
    console.error(
      JSON.stringify({
        event: "workout_save_diagnostic_persistence_failed",
        requestId: input.context.requestId,
        errorReference: input.context.errorReference,
        releaseVersion: input.context.releaseVersion,
      })
    );
  }
}

export function isMaintainer(
  user: { id?: string; email?: string | null },
  configuredValue = process.env.WORKOUT_MAINTAINER_USER_IDS || ""
): boolean {
  const allowed = new Set(
    configuredValue
      .split(",")
      .map((value) => value.trim())
      .filter(Boolean)
  );

  return allowed.has(user.id || "") || allowed.has(user.email || "");
}
