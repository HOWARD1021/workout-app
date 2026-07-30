CREATE TABLE IF NOT EXISTS `training_goals` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `type` text NOT NULL,
  `name` text,
  `exercise_id` text,
  `baseline` real NOT NULL,
  `target` real NOT NULL,
  `window_weeks` integer NOT NULL DEFAULT 8,
  `starts_at` text NOT NULL,
  `ends_at` text NOT NULL,
  `status` text NOT NULL DEFAULT 'active',
  `created_at` text NOT NULL DEFAULT (datetime('now')),
  `updated_at` text NOT NULL DEFAULT (datetime('now')),
  `archived_at` text,
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`exercise_id`) REFERENCES `exercises`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `training_goals_user_status_idx`
  ON `training_goals` (`user_id`, `status`);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `training_goals_one_active_per_user_idx`
  ON `training_goals` (`user_id`)
  WHERE `status` = 'active';
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `weekly_goal_sets` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `goal_id` text NOT NULL,
  `week_start` text NOT NULL,
  `status` text NOT NULL DEFAULT 'suggested',
  `actions` text NOT NULL,
  `accepted_at` text,
  `created_at` text NOT NULL DEFAULT (datetime('now')),
  `updated_at` text NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`goal_id`) REFERENCES `training_goals`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS `weekly_goal_sets_goal_week_idx`
  ON `weekly_goal_sets` (`goal_id`, `week_start`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `weekly_goal_sets_user_week_idx`
  ON `weekly_goal_sets` (`user_id`, `week_start`);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS `goal_adjustment_events` (
  `id` text PRIMARY KEY NOT NULL,
  `user_id` text NOT NULL,
  `goal_id` text NOT NULL,
  `kind` text NOT NULL,
  `previous_target` real,
  `new_target` real,
  `previous_window_weeks` integer,
  `new_window_weeks` integer,
  `previous_exercise_id` text,
  `new_exercise_id` text,
  `note` text,
  `created_at` text NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE cascade,
  FOREIGN KEY (`goal_id`) REFERENCES `training_goals`(`id`) ON UPDATE no action ON DELETE cascade
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `goal_adjustment_events_goal_created_idx`
  ON `goal_adjustment_events` (`goal_id`, `created_at`);
