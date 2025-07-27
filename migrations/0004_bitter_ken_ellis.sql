ALTER TABLE "hs_users" ALTER COLUMN "PasswordHash" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hs_users" ADD COLUMN "Image" varchar(255);--> statement-breakpoint
ALTER TABLE "hs_users" ADD COLUMN "Provider" varchar(255);