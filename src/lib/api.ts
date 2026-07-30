const API_BASE = "/api";

export interface ApiErrorMetadata {
  code?: string;
  errorReference?: string;
  requestId?: string;
  releaseVersion?: string;
}

export class ApiError extends Error {
  status: number;
  code?: string;
  errorReference?: string;
  requestId?: string;
  releaseVersion?: string;
  metadata: ApiErrorMetadata;

  constructor(status: number, message: string, metadata: ApiErrorMetadata = {}) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.code = metadata.code;
    this.errorReference = metadata.errorReference;
    this.requestId = metadata.requestId;
    this.releaseVersion = metadata.releaseVersion;
    this.metadata = metadata;
  }
}

interface ApiErrorPayload extends ApiErrorMetadata {
  error?: string;
  message?: string;
}

function normalizeMetadataValue(value: unknown): string | undefined {
  return typeof value === "string" && value.trim().length > 0 ? value.trim() : undefined;
}

function readHeader(res: Response, ...headerNames: string[]): string | undefined {
  for (const headerName of headerNames) {
    const value = res.headers.get(headerName);
    const normalized = normalizeMetadataValue(value);
    if (normalized) {
      return normalized;
    }
  }

  return undefined;
}

async function readErrorDetails(
  res: Response
): Promise<{ message: string; metadata: ApiErrorMetadata }> {
  const fallbackMessage = `API error: ${res.status}`;
  const headerMetadata: ApiErrorMetadata = {
    code: readHeader(res, "x-error-code"),
    errorReference: readHeader(res, "x-error-reference"),
    requestId: readHeader(res, "x-request-id", "request-id"),
    releaseVersion: readHeader(
      res,
      "x-workout-release-version",
      "x-release-version",
      "release-version"
    ),
  };

  try {
    const data = (await res.json()) as ApiErrorPayload;
    return {
      message:
        normalizeMetadataValue(data.error) ??
        normalizeMetadataValue(data.message) ??
        fallbackMessage,
      metadata: {
        code: normalizeMetadataValue(data.code) ?? headerMetadata.code,
        errorReference:
          normalizeMetadataValue(data.errorReference) ?? headerMetadata.errorReference,
        requestId: normalizeMetadataValue(data.requestId) ?? headerMetadata.requestId,
        releaseVersion:
          normalizeMetadataValue(data.releaseVersion) ?? headerMetadata.releaseVersion,
      },
    };
  } catch {
    return {
      message: fallbackMessage,
      metadata: headerMetadata,
    };
  }
}

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    const { message, metadata } = await readErrorDetails(res);
    throw new ApiError(res.status, message, metadata);
  }

  const data = (await res.json()) as T;
  if (endpoint !== "/workout-diagnostics") {
    void import("@/lib/workout-diagnostics")
      .then(({ flushWorkoutDiagnostics }) => flushWorkoutDiagnostics())
      .catch(() => {});
  }
  return data;
}

// Exercises
export const exercisesApi = {
  list: () => fetchApi<Exercise[]>("/exercises"),
  create: (data: { name: string; type: string; muscle_group: string }) =>
    fetchApi<Exercise>("/exercises", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  getPrevious: (exerciseIds: string[]) =>
    fetchApi<Record<string, { weight: number; reps: number; date: string }>>(
      "/exercises/previous",
      {
        method: "POST",
        body: JSON.stringify({ exercise_ids: exerciseIds }),
      }
    ),
};

// Workouts
export const workoutsApi = {
  list: () => fetchApi<Workout[]>("/workouts"),
  create: (data: {
    id?: string;
    started_at: string;
    ended_at: string;
    template_id?: string;
    logs: Array<{
      exercise_id: string;
      set_order: number;
      weight: number | null;
      reps: number | null;
      note?: string;
    }>;
  }, options?: Pick<RequestInit, "signal">) =>
    fetchApi<Workout & { skippedLogs?: number }>("/workouts", {
      method: "POST",
      body: JSON.stringify(data),
      signal: options?.signal,
    }),
};

// Templates
export const templatesApi = {
  list: () => fetchApi<WorkoutTemplate[]>("/templates"),
  get: (id: string) => fetchApi<TemplateExercise[]>(`/templates/${id}`),
  create: (data: {
    name: string;
    description?: string;
    muscle_group?: string;
    is_favorite?: boolean;
    exercises: Array<{
      exercise_id: string;
      default_sets?: number;
      default_reps?: number;
      default_weight?: number;
    }>;
  }) =>
    fetchApi<WorkoutTemplate>("/templates", {
      method: "POST",
      body: JSON.stringify(data),
    }),
  update: (
    id: string,
    data: { use_count?: number; last_used_at?: string; is_favorite?: boolean }
  ) =>
    fetchApi(`/templates/${id}`, {
      method: "PATCH",
      body: JSON.stringify(data),
    }),
  delete: (id: string) =>
    fetchApi(`/templates/${id}`, {
      method: "DELETE",
    }),
};

// Types
export interface Exercise {
  id: string;
  name: string;
  nameZh: string | null;
  type: string | null;
  muscleGroup: string | null;
  imageUrl: string | null;
  gifUrl: string | null;
  isCustom: boolean | null;
  createdAt: string | null;
  deletedAt: string | null;
}

export interface Workout {
  id: string;
  templateId: string | null;
  startedAt: string;
  endedAt: string | null;
  note: string | null;
  createdAt: string | null;
  deletedAt: string | null;
  workout_logs?: Array<{
    id: string;
    weight: number | null;
    reps: number | null;
    exerciseId: string;
    exercise?: { muscleGroup: string | null };
  }>;
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  description: string | null;
  muscleGroup: string | null;
  isFavorite: boolean | null;
  useCount: number | null;
  lastUsedAt: string | null;
  createdAt: string | null;
  deletedAt: string | null;
  exercise_count?: number;
}

export interface TemplateExercise {
  id: string;
  exerciseId: string;
  orderIndex: number | null;
  defaultSets: number | null;
  defaultReps: number | null;
  defaultWeight: number | null;
  exercise: {
    id: string;
    name: string;
    nameZh: string | null;
    type: string | null;
    muscleGroup: string | null;
    imageUrl: string | null;
    gifUrl: string | null;
  } | null;
}

// Analytics
export interface MuscleGroupData {
  muscleGroup: string;
  totalVolume: number;
  totalSets: number;
}

export interface TrendsData {
  weeks: string[];
  weeklyFrequency: Array<{ week: string; count: number }>;
  muscleGroupTrends: Array<{
    muscleGroup: string;
    weeks: Array<{ week: string; volume: number }>;
  }>;
  exerciseTrends: Array<{
    exerciseId: string;
    exerciseName: string;
    muscleGroup: string;
    weeks: Array<{ week: string; maxWeight: number; volume: number }>;
  }>;
}

export interface ExercisePR {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  maxWeight: number;
  maxWeightReps: number;
  maxWeightDate: string;
  maxVolume: number;
  maxVolumeWeight: number;
  maxVolumeReps: number;
  maxVolumeDate: string;
}

export interface MonthlyRecapExercise {
  exerciseId: string;
  exerciseName: string;
  muscleGroup: string;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  maxWeight: number;
  workoutCount: number;
  lastTrainedAt: string;
}

export interface MonthlyRecapData {
  month: string;
  start: string;
  end: string;
  workoutCount: number;
  exerciseCount: number;
  totalSets: number;
  totalReps: number;
  totalVolume: number;
  totalDurationMinutes: number;
  averageDurationMinutes: number;
  exercises: MonthlyRecapExercise[];
  muscleGroups: Array<{
    muscleGroup: string;
    totalSets: number;
    totalVolume: number;
  }>;
}

export type MonthlyRecapParams = {
  month?: string;
  start?: string;
  end?: string;
};

export const analyticsApi = {
  muscleGroups: () => fetchApi<MuscleGroupData[]>("/analytics/muscle-groups"),
  trends: () => fetchApi<TrendsData>("/analytics/trends"),
  prs: () => fetchApi<ExercisePR[]>("/analytics/prs"),
  monthlyRecap: (params: MonthlyRecapParams = {}) => {
    const search = new URLSearchParams();
    if (params.month) search.set("month", params.month);
    if (params.start) search.set("start", params.start);
    if (params.end) search.set("end", params.end);
    const query = search.toString();
    return fetchApi<MonthlyRecapData>(
      `/analytics/monthly-recap${query ? `?${query}` : ""}`
    );
  },
};

export type GoalType = "strength" | "frequency" | "volume";

export interface TrainingGoal {
  id: string;
  userId?: string;
  type: GoalType;
  name: string | null;
  exerciseId: string | null;
  baseline: number;
  target: number;
  windowWeeks: number;
  startsAt: string;
  endsAt: string;
  status: "active" | "archived" | "replaced";
  createdAt?: string;
  updatedAt?: string;
  archivedAt?: string | null;
}

export interface WeeklyGoalAction {
  id: string;
  label: string;
  muscleGroup?: string;
  exerciseId?: string;
  expectedSessions: number;
  achievedSessions?: number;
  completed?: boolean;
  evidenceWorkoutIds?: string[];
}

export interface GrowthPoint {
  weekStart: string;
  value: number | null;
  actualWeight: number | null;
  reps: number | null;
  setCount: number;
  weeklyVolume: number;
  evidence: Array<{
    logId: string;
    workoutId: string;
    date: string;
    exerciseName: string | null;
    actualWeight: number;
    reps: number;
    estimated1RM: number;
  }>;
}

export interface TrainingReviewData {
  activeGoal: TrainingGoal | null;
  state: "no-goal" | "no-history" | "goal-ready";
  currentWeekStart?: string;
  weeklyGoalSet?: {
    id: string;
    status: "suggested" | "accepted" | "adjusted";
    actions: WeeklyGoalAction[];
    acceptedAt: string | null;
  } | null;
  weeklyProgress: WeeklyGoalAction[];
  progressSummary?: {
    completedActions: number;
    expectedActions: number;
    currentValue: number | null;
    baseline: number;
    delta: number | null;
    hasObservation: boolean;
  };
  growthCurve: GrowthPoint[];
  milestones: Array<{ weekStart: string; kind: string; label: string }>;
  timeline: Array<{
    workoutId: string;
    date: string;
    exercises: string[];
    setCount: number;
    volume: number;
    sets: Array<{
      logId: string;
      exerciseName: string | null;
      weight: number;
      reps: number;
      volume: number;
    }>;
  }>;
  supportingMetrics: {
    frequency: { value: number; label: string };
    volume: { value: number; label: string };
  };
}

export const goalsApi = {
  list: () => fetchApi<{ activeGoal: TrainingGoal | null; goals: TrainingGoal[] }>("/goals"),
  create: (data: {
    type: GoalType;
    target: number;
    exerciseId?: string;
    name?: string;
    windowWeeks?: number;
  }) => fetchApi<TrainingGoal>("/goals", { method: "POST", body: JSON.stringify(data) }),
  update: (data: {
    id: string;
    target?: number;
    windowWeeks?: number;
    name?: string;
    action?: "archive" | "replace";
    newExerciseId?: string;
  }) => fetchApi<TrainingGoal | { previousGoal: TrainingGoal; goal: TrainingGoal }>("/goals", { method: "PATCH", body: JSON.stringify(data) }),
  review: () => fetchApi<TrainingReviewData>("/goals/review"),
  weekly: (goalId?: string) => fetchApi<{ goalId: string; weekStart: string; suggestion: { actions: WeeklyGoalAction[]; status: "suggested" } | null; accepted: { actions: WeeklyGoalAction[]; status: "accepted" | "adjusted" } | null }>(`/goals/weekly${goalId ? `?goalId=${encodeURIComponent(goalId)}` : ""}`),
  createWeekly: (data: { goalId: string; weekStart?: string; actions?: WeeklyGoalAction[]; status?: "suggested" | "accepted" | "adjusted" }) => fetchApi("/goals/weekly", { method: "POST", body: JSON.stringify(data) }),
  updateWeekly: (data: { id: string; actions?: WeeklyGoalAction[]; status?: "suggested" | "accepted" | "adjusted" }) => fetchApi("/goals/weekly", { method: "PATCH", body: JSON.stringify(data) }),
};

// Achievements
export interface AchievementWithStatus {
  id: string;
  name: string;
  nameEn: string;
  description: string;
  descriptionEn: string;
  icon: string;
  category: string;
  conditionType: string;
  conditionValue: number;
  unlocked: boolean;
  unlockedAt: string | null;
}

export const achievementsApi = {
  list: () => fetchApi<AchievementWithStatus[]>("/achievements"),
  check: () =>
    fetchApi<{ newUnlocks: AchievementWithStatus[] }>("/achievements", {
      method: "POST",
    }),
};

// Friends
export interface FriendData {
  id: string;
  friendId: string;
  friendName: string;
  friendImage: string | null;
  status: "pending" | "accepted" | "declined";
  isIncoming: boolean;
  createdAt: string;
}

export const friendsApi = {
  list: () => fetchApi<FriendData[]>("/friends"),
  invite: (email: string) =>
    fetchApi("/friends", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  respond: (id: string, status: "accepted" | "declined") =>
    fetchApi(`/friends/${id}`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    }),
};

// Activity Feed
export interface FeedItem {
  id: string;
  userId: string;
  type: string;
  title: string;
  description: string | null;
  metadata: string | null;
  createdAt: string;
  userName: string;
  userImage: string | null;
  isOwn: boolean;
}

export const feedApi = {
  list: () => fetchApi<FeedItem[]>("/feed"),
};

// Exercise Image Generation
export interface ExerciseImageResult {
  exerciseName: string;
  muscleGroup: string | null;
  type: "demo" | "anatomy";
  mimeType: string;
  base64: string;
}

export const exerciseImageApi = {
  generate: (data: {
    exerciseName: string;
    muscleGroup?: string | null;
    type?: "demo" | "anatomy";
  }) =>
    fetchApi<ExerciseImageResult>("/generate-exercise-image", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
