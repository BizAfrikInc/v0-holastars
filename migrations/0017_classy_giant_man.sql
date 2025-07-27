ALTER TABLE "hs_feedback_requests" ALTER COLUMN "SentAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ALTER COLUMN "SentAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ALTER COLUMN "UpdatedAt" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ALTER COLUMN "UpdatedAt" DROP NOT NULL;