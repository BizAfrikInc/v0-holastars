CREATE TABLE "hs_users_permissions" (
	"UserPermissionId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"UserId" uuid NOT NULL,
	"PermissionId" serial NOT NULL,
	"Granted" boolean DEFAULT true NOT NULL,
	"Created_AT" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hs_users_permissions" ADD CONSTRAINT "fk_user_permission_user_id" FOREIGN KEY ("UserId") REFERENCES "public"."hs_users"("UserId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_users_permissions" ADD CONSTRAINT "fk_user_permission_permission_id" FOREIGN KEY ("PermissionId") REFERENCES "public"."hs_permissions"("PermissionId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_user_permission_idx" ON "hs_users_permissions" USING btree ("UserId","PermissionId");