CREATE TYPE "public"."hs_status" AS ENUM('active', 'inactive', 'pending');--> statement-breakpoint
CREATE TABLE "hs_permissions" (
	"PermissionId" serial NOT NULL,
	"Name" varchar(255) NOT NULL,
	"Module" varchar(255) NOT NULL,
	"Action" varchar(255) NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "hs_roles" (
	"RoleId" serial PRIMARY KEY NOT NULL,
	"Name" varchar(255) NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "hs_users_roles" (
	"UserRoleId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"UserId" uuid NOT NULL,
	"RoleId" serial NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "hs_users" (
	"UserId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"Email" varchar(255) NOT NULL,
	"FirstName" varchar(255),
	"LastName" varchar(255),
	"Username" varchar(255) NOT NULL,
	"PasswordHash" varchar(255) NOT NULL,
	"Status" "hs_status" DEFAULT 'pending' NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "hs_verification_tokens" (
	"TokenId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"UserId" uuid NOT NULL,
	"Token" varchar(256) NOT NULL,
	"Expires_At" timestamp NOT NULL,
	"Created_At" timestamp DEFAULT now()
);
--> statement-breakpoint
ALTER TABLE "hs_users_roles" ADD CONSTRAINT "fk_user_role_user_id " FOREIGN KEY ("UserId") REFERENCES "public"."hs_users"("UserId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_users_roles" ADD CONSTRAINT "fk_user_role_role_id " FOREIGN KEY ("RoleId") REFERENCES "public"."hs_roles"("RoleId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_verification_tokens" ADD CONSTRAINT "fk_verification_tokens_user_id" FOREIGN KEY ("UserId") REFERENCES "public"."hs_users"("UserId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_role_idx" ON "hs_users_roles" USING btree ("UserId","RoleId");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_email_idx" ON "hs_users" USING btree ("Email");