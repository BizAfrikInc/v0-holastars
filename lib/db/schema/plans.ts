import {
  numeric,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

export const billingCycleEnum = pgEnum("hs_billing_cycle", ["monthly", "semi_annually", "annually"]);

export const plans = pgTable("plans", {
  id: uuid("PlanId").primaryKey().defaultRandom(),
  name: varchar("Name", { length: 255 }).notNull(),
  description: text("Description"),
  price: numeric("Price", { precision: 10, scale: 2 }).notNull(),
  billingCycle: billingCycleEnum("BillingCycle").notNull(),
  createdAt: timestamp("CreatedAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("UpdatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("unique_plan_name").on(table.name),
]);

export type Plan = typeof plans.$inferSelect;
export type NewPlan = typeof plans.$inferInsert;
