ALTER TABLE "hs_customers" DROP CONSTRAINT "fk_customers_location_id";
--> statement-breakpoint
ALTER TABLE "hs_customers" DROP CONSTRAINT "fk_customers_department_id";
--> statement-breakpoint
ALTER TABLE "hs_customers" ADD COLUMN "CustomerName" varchar(255) NOT NULL;--> statement-breakpoint
ALTER TABLE "hs_customers" ADD COLUMN "PhoneNumber" varchar(50);--> statement-breakpoint
ALTER TABLE "hs_customers" DROP COLUMN "LocationId";--> statement-breakpoint
ALTER TABLE "hs_customers" DROP COLUMN "DepartmentId";--> statement-breakpoint
ALTER TABLE "hs_customers" DROP COLUMN "FirstName";--> statement-breakpoint
ALTER TABLE "hs_customers" DROP COLUMN "LastName";--> statement-breakpoint
ALTER TABLE "hs_customers" DROP COLUMN "Phone";