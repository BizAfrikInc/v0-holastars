ALTER TABLE "departments" RENAME TO "hs_departments";--> statement-breakpoint
ALTER TABLE "locations" RENAME TO "hs_locations";--> statement-breakpoint
ALTER TABLE "hs_departments" DROP CONSTRAINT "fk_department_location_location_id";
--> statement-breakpoint
ALTER TABLE "hs_locations" DROP CONSTRAINT "fk_business_location_business_id";
--> statement-breakpoint
ALTER TABLE "hs_departments" ADD CONSTRAINT "fk_department_location_location_id" FOREIGN KEY ("LocationId") REFERENCES "public"."hs_locations"("LocationId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "hs_locations" ADD CONSTRAINT "fk_business_location_business_id" FOREIGN KEY ("BusinessId") REFERENCES "public"."hs_businesses"("BusinessId") ON DELETE cascade ON UPDATE no action;