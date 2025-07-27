ALTER TABLE "hs_feedback_requests" RENAME COLUMN "Custommers" TO "CustomerIds";--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ALTER COLUMN "Channel" SET NOT NULL;