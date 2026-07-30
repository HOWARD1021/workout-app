CREATE TABLE IF NOT EXISTS `workout_save_events` (
  `id` text PRIMARY KEY NOT NULL,
  `error_reference` text NOT NULL,
  `request_id` text NOT NULL,
  `submission_id` text,
  `user_id` text,
  `operation` text NOT NULL,
  `status` text NOT NULL,
  `error_code` text,
  `http_status` integer NOT NULL,
  `release_version` text NOT NULL,
  `context` text NOT NULL,
  `created_at` text NOT NULL DEFAULT (datetime('now')),
  FOREIGN KEY (`user_id`) REFERENCES `user`(`id`) ON UPDATE no action ON DELETE set null
);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `workout_save_events_error_reference_idx`
  ON `workout_save_events` (`error_reference`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `workout_save_events_submission_id_idx`
  ON `workout_save_events` (`submission_id`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `workout_save_events_release_version_idx`
  ON `workout_save_events` (`release_version`);
--> statement-breakpoint
CREATE INDEX IF NOT EXISTS `workout_save_events_created_at_idx`
  ON `workout_save_events` (`created_at`);
