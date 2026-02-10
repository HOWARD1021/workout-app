CREATE TABLE `exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`type` text,
	`muscle_group` text,
	`is_custom` integer DEFAULT true,
	`created_at` text DEFAULT (datetime('now')),
	`deleted_at` text
);
--> statement-breakpoint
CREATE UNIQUE INDEX `exercises_name_unique` ON `exercises` (`name`);--> statement-breakpoint
CREATE TABLE `workout_logs` (
	`id` text PRIMARY KEY NOT NULL,
	`workout_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`set_order` integer DEFAULT 0,
	`weight` real,
	`reps` integer,
	`distance_km` real,
	`duration_minutes` real,
	`note` text,
	`created_at` text DEFAULT (datetime('now')),
	FOREIGN KEY (`workout_id`) REFERENCES `workouts`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workout_template_exercises` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text NOT NULL,
	`exercise_id` text NOT NULL,
	`order_index` integer DEFAULT 0,
	`default_sets` integer DEFAULT 3,
	`default_reps` integer,
	`default_weight` real,
	FOREIGN KEY (`template_id`) REFERENCES `workout_templates`(`id`) ON UPDATE no action ON DELETE cascade,
	FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `workout_templates` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text,
	`muscle_group` text,
	`is_favorite` integer DEFAULT false,
	`use_count` integer DEFAULT 0,
	`last_used_at` text,
	`created_at` text DEFAULT (datetime('now')),
	`deleted_at` text
);
--> statement-breakpoint
CREATE TABLE `workouts` (
	`id` text PRIMARY KEY NOT NULL,
	`template_id` text,
	`started_at` text DEFAULT (datetime('now')) NOT NULL,
	`ended_at` text,
	`note` text,
	`created_at` text DEFAULT (datetime('now')),
	`deleted_at` text,
	FOREIGN KEY (`template_id`) REFERENCES `workout_templates`(`id`) ON UPDATE no action ON DELETE set null
);
