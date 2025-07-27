CREATE TABLE "hs_business" (
	"BusinessId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"userId" uuid NOT NULL,
	"Email" varchar(255) NOT NULL,
	"BusinessName" varchar(255) NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp
);
--> statement-breakpoint
CREATE TABLE "locations" (
	"LocationId" uuid PRIMARY KEY DEFAULT gen_random_uuid() NOT NULL,
	"BusinessId" uuid NOT NULL,
	"Name" varchar(255) NOT NULL,
	"Address" varchar(500) NOT NULL,
	"Created_At" timestamp DEFAULT now() NOT NULL,
	"Updated_At" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hs_business" ADD CONSTRAINT "fk_user_business_user_id" FOREIGN KEY ("userId") REFERENCES "public"."hs_users"("UserId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "locations" ADD CONSTRAINT "fk_business_location_business_id" FOREIGN KEY ("BusinessId") REFERENCES "public"."hs_business"("BusinessId") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint
CREATE UNIQUE INDEX "unique_business_email_idx" ON "hs_business" USING btree ("Email");