ALTER TABLE "hs_feedback_requests" ALTER COLUMN "Channel" SET DEFAULT 'email'::"public"."hs_feedback_channel";--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ALTER COLUMN "Channel" SET DATA TYPE "public"."hs_feedback_channel" USING "Channel"::"public"."hs_feedback_channel";--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ALTER COLUMN "Channel" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ALTER COLUMN "SentAt" SET DEFAULT now();--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ADD COLUMN "Custommers" text[] DEFAULT ARRAY[]::text[] NOT NULL;--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" DROP COLUMN "OpenedAt";