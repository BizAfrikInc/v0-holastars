ALTER TABLE "hs_feedback_templates" ALTER COLUMN "UpdatedAt" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hs_template_questions" ADD COLUMN "Options" text[];