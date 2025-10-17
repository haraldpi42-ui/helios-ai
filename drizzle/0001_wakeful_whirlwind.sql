CREATE TABLE `agents` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`name` varchar(255) NOT NULL,
	`description` text,
	`agentType` varchar(64) NOT NULL,
	`configuration` text,
	`n8nWorkflowId` varchar(64),
	`isPublic` enum('yes','no') NOT NULL DEFAULT 'no',
	`remixCount` varchar(32) DEFAULT '0',
	`experienceCount` varchar(32) DEFAULT '0',
	`evolvingScore` varchar(32) DEFAULT '0',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `agents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `conversations` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255),
	`agentType` varchar(64) NOT NULL DEFAULT 'general',
	`status` enum('active','archived') NOT NULL DEFAULT 'active',
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `conversations_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `documents` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`title` varchar(255) NOT NULL,
	`content` text NOT NULL,
	`fileUrl` varchar(512),
	`mimeType` varchar(128),
	`size` varchar(32),
	`createdAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `documents_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `messages` (
	`id` varchar(64) NOT NULL,
	`conversationId` varchar(64) NOT NULL,
	`role` enum('user','assistant','system') NOT NULL,
	`content` text NOT NULL,
	`metadata` text,
	`createdAt` timestamp DEFAULT (now()),
	CONSTRAINT `messages_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `tasks` (
	`id` varchar(64) NOT NULL,
	`userId` varchar(64) NOT NULL,
	`conversationId` varchar(64),
	`taskType` varchar(64) NOT NULL,
	`status` enum('pending','processing','completed','failed') NOT NULL DEFAULT 'pending',
	`input` text NOT NULL,
	`output` text,
	`errorMessage` text,
	`n8nExecutionId` varchar(64),
	`createdAt` timestamp DEFAULT (now()),
	`completedAt` timestamp,
	CONSTRAINT `tasks_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
CREATE TABLE `userCredits` (
	`userId` varchar(64) NOT NULL,
	`credits` varchar(32) NOT NULL DEFAULT '1000',
	`totalUsed` varchar(32) NOT NULL DEFAULT '0',
	`lastResetAt` timestamp DEFAULT (now()),
	`updatedAt` timestamp DEFAULT (now()) ON UPDATE CURRENT_TIMESTAMP,
	CONSTRAINT `userCredits_userId` PRIMARY KEY(`userId`)
);
