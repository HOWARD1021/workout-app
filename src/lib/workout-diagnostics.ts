export type WorkoutDiagnosticCategory = "api" | "abort" | "network" | "unknown";

export interface QueuedWorkoutDiagnostic {
  id: string;
  createdAt: string;
  operation: "workout_save";
  category: WorkoutDiagnosticCategory;
  httpStatus?: number;
  code?: string;
  errorReference?: string;
  requestId?: string;
  submissionId?: string;
  releaseVersion?: string;
}

export interface EnqueueWorkoutDiagnosticInput {
  category: WorkoutDiagnosticCategory;
  httpStatus?: number;
  code?: string;
  errorReference?: string;
  requestId?: string;
  submissionId?: string;
  releaseVersion?: string;
}

const STORAGE_KEY = "workout-diagnostics-queue";
const MAX_QUEUE_SIZE = 20;
const FLUSH_BATCH_SIZE = 10;

function normalizeString(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function createDiagnosticId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return `client-${crypto.randomUUID()}`;
  }

  return `client-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}

function canUseLocalStorage(): boolean {
  return typeof window !== "undefined" && typeof window.localStorage !== "undefined";
}

function sanitizeDiagnostic(
  diagnostic: Partial<QueuedWorkoutDiagnostic>
): QueuedWorkoutDiagnostic | null {
  const category = diagnostic.category;

  if (
    category !== "api" &&
    category !== "abort" &&
    category !== "network" &&
    category !== "unknown"
  ) {
    return null;
  }

  const httpStatus =
    typeof diagnostic.httpStatus === "number" && Number.isFinite(diagnostic.httpStatus)
      ? diagnostic.httpStatus
      : undefined;

  return {
    id: normalizeString(diagnostic.id) ?? createDiagnosticId(),
    createdAt: normalizeString(diagnostic.createdAt) ?? new Date().toISOString(),
    operation: "workout_save",
    category,
    httpStatus,
    code: normalizeString(diagnostic.code),
    errorReference: normalizeString(diagnostic.errorReference),
    requestId: normalizeString(diagnostic.requestId),
    submissionId: normalizeString(diagnostic.submissionId),
    releaseVersion: normalizeString(diagnostic.releaseVersion),
  };
}

function readQueue(): QueuedWorkoutDiagnostic[] {
  if (!canUseLocalStorage()) {
    return [];
  }

  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];

    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];

    return parsed
      .map((item) =>
        sanitizeDiagnostic(
          item && typeof item === "object"
            ? (item as Partial<QueuedWorkoutDiagnostic>)
            : {}
        )
      )
      .filter((item): item is QueuedWorkoutDiagnostic => item !== null)
      .slice(-MAX_QUEUE_SIZE);
  } catch {
    return [];
  }
}

function writeQueue(queue: QueuedWorkoutDiagnostic[]): void {
  if (!canUseLocalStorage()) {
    return;
  }

  try {
    const bounded = queue.slice(-MAX_QUEUE_SIZE);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(bounded));
  } catch {
    // Diagnostic capture is best effort and must never block workout recovery.
  }
}

export function enqueueWorkoutDiagnostic(
  input: EnqueueWorkoutDiagnosticInput
): QueuedWorkoutDiagnostic {
  const entry = sanitizeDiagnostic({
    ...input,
    id: createDiagnosticId(),
    createdAt: new Date().toISOString(),
  });

  if (!entry) {
    throw new Error("Invalid workout diagnostic category");
  }

  const nextQueue = [...readQueue(), entry];
  writeQueue(nextQueue);
  return entry;
}

export async function flushWorkoutDiagnostics(options?: {
  fetchImpl?: typeof fetch;
}): Promise<{ sent: number; remaining: number }> {
  const queue = readQueue();
  if (queue.length === 0) {
    return { sent: 0, remaining: 0 };
  }

  const batch = queue.slice(0, FLUSH_BATCH_SIZE);
  const fetchImpl = options?.fetchImpl ?? globalThis.fetch?.bind(globalThis);

  if (!fetchImpl) {
    return { sent: 0, remaining: queue.length };
  }

  const response = await fetchImpl("/api/workout-diagnostics", {
    method: "POST",
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ events: batch }),
  });

  if (!response.ok) {
    throw new Error(`Failed to flush workout diagnostics: ${response.status}`);
  }

  writeQueue(queue.slice(batch.length));
  return {
    sent: batch.length,
    remaining: Math.max(queue.length - batch.length, 0),
  };
}
