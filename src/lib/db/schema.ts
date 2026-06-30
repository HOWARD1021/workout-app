import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// Better Auth tables
export const user = sqliteTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: integer("email_verified", { mode: "boolean" }).notNull(),
  image: text("image"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const session = sqliteTable("session", {
  id: text("id").primaryKey(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  token: text("token").notNull().unique(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = sqliteTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: integer("access_token_expires_at", { mode: "timestamp_ms" }),
  refreshTokenExpiresAt: integer("refresh_token_expires_at", { mode: "timestamp_ms" }),
  scope: text("scope"),
  password: text("password"),
  createdAt: integer("created_at", { mode: "timestamp_ms" }).notNull(),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }).notNull(),
});

export const verification = sqliteTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: integer("expires_at", { mode: "timestamp_ms" }).notNull(),
  createdAt: integer("created_at", { mode: "timestamp_ms" }),
  updatedAt: integer("updated_at", { mode: "timestamp_ms" }),
});

// exercises 運動項目
export const exercises = sqliteTable("exercises", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  nameZh: text("name_zh"),
  type: text("type", {
    enum: ["Strength", "Cardio", "Flexibility", "Other"],
  }),
  muscleGroup: text("muscle_group", {
    enum: ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Full Body", "Other"],
  }),
  imageUrl: text("image_url"),
  gifUrl: text("gif_url"),
  isCustom: integer("is_custom", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  deletedAt: text("deleted_at"),
});

// workout_templates 運動模板
export const workoutTemplates = sqliteTable("workout_templates", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => user.id),
  name: text("name").notNull(),
  description: text("description"),
  muscleGroup: text("muscle_group"),
  isFavorite: integer("is_favorite", { mode: "boolean" }).default(false),
  useCount: integer("use_count").default(0),
  lastUsedAt: text("last_used_at"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  deletedAt: text("deleted_at"),
});

// workout_template_exercises 模板動作
export const workoutTemplateExercises = sqliteTable("workout_template_exercises", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  templateId: text("template_id")
    .notNull()
    .references(() => workoutTemplates.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => exercises.id),
  orderIndex: integer("order_index").default(0),
  defaultSets: integer("default_sets").default(3),
  defaultReps: integer("default_reps"),
  defaultWeight: real("default_weight"),
});

// workouts 健身 Session
export const workouts = sqliteTable("workouts", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id").references(() => user.id),
  templateId: text("template_id").references(() => workoutTemplates.id, {
    onDelete: "set null",
  }),
  startedAt: text("started_at")
    .notNull()
    .default(sql`(datetime('now'))`),
  endedAt: text("ended_at"),
  note: text("note"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  deletedAt: text("deleted_at"),
});

// workout_logs 詳細組數記錄
export const workoutLogs = sqliteTable("workout_logs", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  workoutId: text("workout_id")
    .notNull()
    .references(() => workouts.id, { onDelete: "cascade" }),
  exerciseId: text("exercise_id")
    .notNull()
    .references(() => exercises.id),
  setOrder: integer("set_order").default(0),
  weight: real("weight"),
  reps: integer("reps"),
  distanceKm: real("distance_km"),
  durationMinutes: real("duration_minutes"),
  note: text("note"),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
});

// achievements 成就定義
export const achievements = sqliteTable("achievements", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  nameEn: text("name_en").notNull(),
  description: text("description").notNull(),
  descriptionEn: text("description_en").notNull(),
  icon: text("icon").notNull(),
  category: text("category", {
    enum: ["first", "streak", "count", "volume", "muscle", "pr"],
  }).notNull(),
  conditionType: text("condition_type").notNull(),
  conditionValue: integer("condition_value").notNull(),
});

// user_achievements 用戶已解鎖成就
export const userAchievements = sqliteTable("user_achievements", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  achievementId: text("achievement_id")
    .notNull()
    .references(() => achievements.id),
  unlockedAt: text("unlocked_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// friendships 好友關係
export const friendships = sqliteTable("friendships", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  requesterId: text("requester_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  addresseeId: text("addressee_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  status: text("status", {
    enum: ["pending", "accepted", "declined"],
  })
    .notNull()
    .default("pending"),
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// activity_feed 動態
export const activityFeed = sqliteTable("activity_feed", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  type: text("type", {
    enum: ["workout", "achievement", "streak"],
  }).notNull(),
  title: text("title").notNull(),
  description: text("description"),
  metadata: text("metadata"), // JSON string for extra data
  createdAt: text("created_at")
    .notNull()
    .default(sql`(datetime('now'))`),
});

// Type exports
export type Exercise = typeof exercises.$inferSelect;
export type NewExercise = typeof exercises.$inferInsert;
export type Workout = typeof workouts.$inferSelect;
export type NewWorkout = typeof workouts.$inferInsert;
export type WorkoutLog = typeof workoutLogs.$inferSelect;
export type NewWorkoutLog = typeof workoutLogs.$inferInsert;
export type WorkoutTemplate = typeof workoutTemplates.$inferSelect;
export type NewWorkoutTemplate = typeof workoutTemplates.$inferInsert;
export type WorkoutTemplateExercise = typeof workoutTemplateExercises.$inferSelect;
export type Achievement = typeof achievements.$inferSelect;
export type UserAchievement = typeof userAchievements.$inferSelect;
export type Friendship = typeof friendships.$inferSelect;
export type ActivityFeedItem = typeof activityFeed.$inferSelect;
