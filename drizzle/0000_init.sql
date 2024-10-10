CREATE TABLE `orders` (
	`orderId` integer PRIMARY KEY NOT NULL,
	`customerId` integer NOT NULL,
	`productId` integer NOT NULL,
	FOREIGN KEY (`productId`) REFERENCES `products`(`id`) ON UPDATE no action ON DELETE no action
);
--> statement-breakpoint
CREATE TABLE `products` (
	`id` integer PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`price` real NOT NULL,
	`stock` integer NOT NULL
);
