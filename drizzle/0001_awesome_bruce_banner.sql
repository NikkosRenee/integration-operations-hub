CREATE TABLE `activities` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`action` text NOT NULL,
	`entity` text NOT NULL,
	`entity_id` integer,
	`message` text NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
ALTER TABLE `clients` ADD `website` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `clients` ADD `phone` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `clients` ADD `notes` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `clients` ADD `last_contact` text;--> statement-breakpoint
ALTER TABLE `projects` ADD `description` text DEFAULT '' NOT NULL;--> statement-breakpoint
ALTER TABLE `projects` ADD `priority` text DEFAULT 'Medium' NOT NULL;--> statement-breakpoint
ALTER TABLE `tasks` ADD `estimated_minutes` integer DEFAULT 30 NOT NULL;