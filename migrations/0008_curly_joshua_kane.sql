CREATE TABLE "departments" (
	"DepartmentId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"LocationId" uuid NOT NULL,
	"Name" varchar(255) NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp
);
--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "Updated_At" DROP DEFAULT;--> statement-breakpoint
ALTER TABLE "locations" ALTER COLUMN "Updated_At" DROP NOT NULL;--> statement-breakpoint
ALTER TABLE "departments" ADD CONSTRAINT "fk_department_location_location_id" FOREIGN KEY ("LocationId") REFERENCES "public"."locations"("LocationId") ON DELETE cascade ON UPDATE no action;