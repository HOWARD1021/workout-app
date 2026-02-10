import { sqliteTable, text, integer, real } from "drizzle-orm/sqlite-core";
import { sql } from "drizzle-orm";

// exercises 運動項目
export const exercises = sqliteTable("exercises", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name").notNull().unique(),
  type: text("type", {
    enum: ["Strength", "Cardio", "Flexibility", "Other"],
  }),
  muscleGroup: text("muscle_group", {
    enum: ["Chest", "Back", "Legs", "Shoulders", "Arms", "Core", "Full Body", "Other"],
  }),
  isCustom: integer("is_custom", { mode: "boolean" }).default(true),
  createdAt: text("created_at").default(sql`(datetime('now'))`),
  deletedAt: text("deleted_at"),
});

// workout_templates 運動模板
export const workoutTemplates = sqliteTable("workout_templates", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
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
