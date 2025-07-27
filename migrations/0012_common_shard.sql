CREATE TYPE "public"."hs_customer_status" AS ENUM('active', 'inactive');--> statement-breakpoint
CREATE TYPE "public"."feedback_req_status" AS ENUM('pending', 'sent', 'failed', 'opened');--> statement-breakpoint
CREATE TYPE "public"."hs_feedback_channel" AS ENUM('email', 'sms', 'whatsapp');--> statement-breakpoint
CREATE TYPE "public"."hs_billing_cycle" AS ENUM('monthly', 'semi_annually', 'annually');--> statement-breakpoint
CREATE TYPE "public"."billing_cycle" AS ENUM('monthly', 'semi_annually', 'annually');--> statement-breakpoint
CREATE TYPE "public"."hs_subscription_status" AS ENUM('active', 'pending', 'canceled');--> statement-breakpoint
CREATE TYPE "public"."hs_input_types" AS ENUM('input', 'textarea', 'radio', 'checkbox');--> statement-breakpoint
CREATE TABLE "hs_customers" (
	"CustomerId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"BusinessId" uuid NOT NULL,
	"LocationId" uuid,
	"DepartmentId" uuid,
	"FirstName" varchar(255) NOT NULL,
	"LastName" varchar(255) NOT NULL,
	"Email" varchar(255) NOT NULL,
	"Phone" varchar(50),
	"CustomerStatus" "hs_customer_status" DEFAULT 'active' NOT NULL,
	"CreatedAt" timestamp DEFAULT now() NOT NULL,
	"UpdatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hs_feedback_requests" (
	"FeedbackRequestId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"BusinessIdd" uuid NOT NULL,
	"LocationId" uuid,
	"DepartmentId" uuid,
	"Channel" varchar(50) NOT NULL,
	"TemplateId" uuid NOT NULL,
	"RequesterId" uuid NOT NULL,
	"status" "feedback_req_status" DEFAULT 'pending' NOT NULL,
	"SentAt" timestamp NOT NULL,
	"OpenedAt" timestamp,
	"CreatedAt" timestamp DEFAULT now() NOT NULL,
	"UpdatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hs_feedback_responses" (
	"FeedbackResponseId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"FeedbackRequestId" uuid NOT NULL,
	"CustomerId" uuid NOT NULL,
	"SubmittedAt" timestamp DEFAULT now() NOT NULL,
	"CreatedAt" timestamp DEFAULT now() NOT NULL,
	"UpdatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hs_feedback_templates" (
	"TemplateId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"Name" varchar(255) NOT NULL,
	"Channel" "hs_feedback_channel" DEFAULT 'email',
	"DisplayCompanyLogo" boolean DEFAULT false NOT NULL,
	"CompanyLogo" varchar(500),
	"DisplayCompanyStatement" boolean DEFAULT false NOT NULL,
	"CompanyStatement" text,
	"CreatedAt" timestamp DEFAULT now() NOT NULL,
	"UpdatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plan_permissions" (
	"PlanPermissionId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"PlanId" uuid NOT NULL,
	"PermissionId" serial NOT NULL,
	"CreatedAt" timestamp DEFAULT now() NOT NULL,
	"UpdatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "plans" (
	"PlanId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"Name" varchar(255) NOT NULL,
	"Description" text,
	"Price" numeric(10, 2) NOT NULL,
	"BillingCycle" "hs_billing_cycle" NOT NULL,
	"CreatedAt" timestamp DEFAULT now() NOT NULL,
	"UpdatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hs_question_answers" (
	"QuestionAnswerId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"TemplateQuestionId" uuid NOT NULL,
	"CustomerId" uuid NOT NULL,
	"answer" text NOT NULL,
	"CreatedAt" timestamp DEFAULT now() NOT NULL,
	"UpdatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "subscriptions" (
	"SubscriptionId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"UserPlanId" uuid NOT NULL,
	"billing_cycle" "billing_cycle" NOT NULL,
	"AmountPaid" numeric(10, 2) NOT NULL,
	"NextBillingDat" timestamp NOT NULL,
	"SubscriptionStatus" "hs_subscription_status" NOT NULL,
	"CharityContribution" numeric(10, 2),
	"CreatedAt" timestamp DEFAULT now() NOT NULL,
	"UpdatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hs_template_questions" (
	"TemplateQuestionId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"TemplateId" uuid NOT NULL,
	"QuestionNumber" serial NOT NULL,
	"QuestionText" text NOT NULL,
	"FieldType" "hs_input_types" DEFAULT 'input',
	"IsRequired" boolean DEFAULT false NOT NULL,
	"CreatedAt" timestamp DEFAULT now() NOT NULL,
	"UpdatedAt" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "user_plans" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"user_id" uuid NOT NULL,
	"plan_id" uuid NOT NULL,
	"is_active" boolean DEFAULT true NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hs_users" ALTER COLUMN "Status" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "hs_customers" ADD CONSTRAINT "fk_customers_business_id" FOREIGN KEY ("BusinessId") REFERENCES "public"."hs_businesses"("BusinessId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_customers" ADD CONSTRAINT "fk_customers_location_id" FOREIGN KEY ("LocationId") REFERENCES "public"."hs_locations"("LocationId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_customers" ADD CONSTRAINT "fk_customers_department_id" FOREIGN KEY ("DepartmentId") REFERENCES "public"."hs_departments"("DepartmentId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ADD CONSTRAINT "hs_feedback_requests_BusinessIdd_hs_businesses_BusinessId_fk" FOREIGN KEY ("BusinessIdd") REFERENCES "public"."hs_businesses"("BusinessId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ADD CONSTRAINT "hs_feedback_requests_LocationId_hs_locations_LocationId_fk" FOREIGN KEY ("LocationId") REFERENCES "public"."hs_locations"("LocationId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ADD CONSTRAINT "hs_feedback_requests_DepartmentId_hs_departments_DepartmentId_fk" FOREIGN KEY ("DepartmentId") REFERENCES "public"."hs_departments"("DepartmentId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ADD CONSTRAINT "hs_feedback_requests_TemplateId_hs_feedback_templates_TemplateId_fk" FOREIGN KEY ("TemplateId") REFERENCES "public"."hs_feedback_templates"("TemplateId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_feedback_requests" ADD CONSTRAINT "hs_feedback_requests_RequesterId_hs_users_UserId_fk" FOREIGN KEY ("RequesterId") REFERENCES "public"."hs_users"("UserId") ON DELETE set null ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_feedback_responses" ADD CONSTRAINT "hs_feedback_responses_FeedbackRequestId_hs_feedback_requests_FeedbackRequestId_fk" FOREIGN KEY ("FeedbackRequestId") REFERENCES "public"."hs_feedback_requests"("FeedbackRequestId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_feedback_responses" ADD CONSTRAINT "hs_feedback_responses_CustomerId_hs_customers_CustomerId_fk" FOREIGN KEY ("CustomerId") REFERENCES "public"."hs_customers"("CustomerId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_permissions" ADD CONSTRAINT "fk_planpermissions_plan_id" FOREIGN KEY ("PlanId") REFERENCES "public"."plans"("PlanId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "plan_permissions" ADD CONSTRAINT "fk_planpermissions_permission_id" FOREIGN KEY ("PermissionId") REFERENCES "public"."hs_permissions"("PermissionId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_question_answers" ADD CONSTRAINT "fk_answers_customer" FOREIGN KEY ("CustomerId") REFERENCES "public"."hs_customers"("CustomerId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_question_answers" ADD CONSTRAINT "fk_answers_template_question" FOREIGN KEY ("TemplateQuestionId") REFERENCES "public"."hs_template_questions"("TemplateQuestionId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "subscriptions" ADD CONSTRAINT "fk_subscription_user_plan_id" FOREIGN KEY ("UserPlanId") REFERENCES "public"."user_plans"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_template_questions" ADD CONSTRAINT "fk_template_question_template_id" FOREIGN KEY ("TemplateId") REFERENCES "public"."hs_feedback_templates"("TemplateId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_plans" ADD CONSTRAINT "fk_user_plans_user_id" FOREIGN KEY ("user_id") REFERENCES "public"."hs_users"("UserId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "user_plans" ADD CONSTRAINT "fk_user_plans_plan_id" FOREIGN KEY ("plan_id") REFERENCES "public"."plans"("PlanId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_customer_email_business" ON "hs_customers" USING btree ("BusinessId","Email");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_plan_permission" ON "plan_permissions" USING btree ("PlanId","PermissionId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_plan_name" ON "plans" USING btree ("Name");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_plan_cycle" ON "subscriptions" USING btree ("UserPlanId","billing_cycle");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_plan" ON "user_plans" USING btree ("user_id","plan_id");