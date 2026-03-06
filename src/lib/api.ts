const API_BASE = "/api";

export async function fetchApi<T>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
  });

  if (!res.ok) {
    throw new Error(`API error: ${res.status}`);
  }

  return res.json();
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
    started_at: string;
    ended_at: string;
    template_id?: string;
    logs: Array<{
      exercise_id: string;
      set_order: number;
      weight: number | null;
      reps: number | null;
    }>;
  }) =>
    fetchApi<Workout>("/workouts", {
      method: "POST",
      body: JSON.stringify(data),
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
  type: string | null;
  muscleGroup: string | null;
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
    type: string | null;
    muscleGroup: string | null;
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

export const analyticsApi = {
  muscleGroups: () => fetchApi<MuscleGroupData[]>("/analytics/muscle-groups"),
  trends: () => fetchApi<TrendsData>("/analytics/trends"),
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
