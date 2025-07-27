CREATE TABLE "hs_roles_permissions" (
	"RolePermissionId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"RoleId" serial NOT NULL,
	"PermissionId" serial NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hs_users_roles" DROP CONSTRAINT "fk_user_role_user_id ";
--> statement-breakpoint
ALTER TABLE "hs_roles_permissions" ADD CONSTRAINT "fk_role_permission_role_id" FOREIGN KEY ("RoleId") REFERENCES "public"."hs_roles"("RoleId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_roles_permissions" ADD CONSTRAINT "fk_role_permission_permission_id" FOREIGN KEY ("PermissionId") REFERENCES "public"."hs_permissions"("PermissionId") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_role_permission_idx" ON "hs_roles_permissions" USING btree ("RoleId","PermissionId");--> statement-breakpoint
ALTER TABLE "hs_users_roles" ADD CONSTRAINT "fk_user_role_user_id " FOREIGN KEY ("UserId") REFERENCES "public"."hs_users"("UserId") ON DELETE cascade ON UPDATE no action;