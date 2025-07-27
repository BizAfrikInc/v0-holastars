ALTER TABLE "hs_business" RENAME TO "hs_businesses";--> statement-breakpoint
ALTER TABLE "hs_businesses" DROP CONSTRAINT "fk_user_business_user_id";
--> statement-breakpoint
ALTER TABLE "locations" DROP CONSTRAINT "fk_business_location_business_id";
--> statement-breakpoint
ALTER TABLE "hs_businesses" ADD CONSTRAINT "fk_user_business_user_id" FOREIGN KEY ("userId") REFERENCES "public"."hs_users"("UserId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "fk_business_location_business_id" FOREIGN KEY ("BusinessId") REFERENCES "public"."hs_businesses"("BusinessId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_business_name_idx" ON "hs_businesses" USING btree ("BusinessName");--> statement-breakpoint
CREATE UNIQUE INDEX "unique_location_address_idx" ON "locations" USING btree ("Address");