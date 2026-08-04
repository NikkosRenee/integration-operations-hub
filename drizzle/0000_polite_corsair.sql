CREATE TABLE `clients` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`name` text NOT NULL,
	`contact` text DEFAULT '' NOT NULL,
	`email` text DEFAULT '' NOT NULL,
	`services` text DEFAULT '' NOT NULL,
	`status` text DEFAULT 'Active' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `projects` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`client_id` integer NOT NULL,
	`name` text NOT NULL,
	`status` text DEFAULT 'Active' NOT NULL,
	`health` text DEFAULT 'Green' NOT NULL,
	`progress` integer DEFAULT 0 NOT NULL,
	`due_date` text,
	`next_action` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`project_id` integer,
	`client_id` integer,
	`title` text NOT NULL,
	`status` text DEFAULT 'Next' NOT NULL,
	`priority` text DEFAULT 'Medium' NOT NULL,
	`type` text DEFAULT 'Standard' NOT NULL,
	`due_date` text,
	`notes` text DEFAULT '' NOT NULL,
	`created_at` text NOT NULL,
	`completed_at` text
);
--> statement-breakpoint
INSERT INTO `clients` (`id`,`name`,`contact`,`email`,`services`,`status`,`created_at`) VALUES
(1,'PV Labels','Operations','','Web · Shopify · Automation','Active','2026-08-03T00:00:00.000Z'),
(2,'USA Stickers','E-commerce team','','Shopify · SEO · QuickBooks','Active','2026-08-03T00:00:00.000Z'),
(3,'Stickers Quick','Marketing','','SEO · Web development','Active','2026-08-03T00:00:00.000Z');
--> statement-breakpoint
INSERT INTO `projects` (`id`,`client_id`,`name`,`status`,`health`,`progress`,`due_date`,`next_action`,`created_at`) VALUES
(1,1,'Customer order intelligence','Active','Yellow',58,'2026-08-14','Map repeat-order SKU matching rules','2026-08-03T00:00:00.000Z'),
(2,2,'Store operations integration','Active','Green',76,'2026-08-10','Validate QuickBooks location mapping','2026-08-03T00:00:00.000Z'),
(3,3,'SEO content rollout','Waiting on Client','Yellow',42,'2026-08-21','Approve category keyword priorities','2026-08-03T00:00:00.000Z');
--> statement-breakpoint
INSERT INTO `tasks` (`id`,`project_id`,`client_id`,`title`,`status`,`priority`,`type`,`due_date`,`notes`,`created_at`) VALUES
(1,1,1,'Document recurring customer order patterns','In Progress','High','Special Request','2026-08-03','','2026-08-03T00:00:00.000Z'),
(2,2,2,'Confirm order-location sync rules','Next','High','Standard','2026-08-04','','2026-08-03T00:00:00.000Z'),
(3,3,3,'Review category descriptions for search intent','Waiting','Medium','Standard','2026-08-06','','2026-08-03T00:00:00.000Z'),
(4,1,1,'Create PDF-to-SKU extraction checklist','Backlog','Medium','Standard','2026-08-08','','2026-08-03T00:00:00.000Z');
