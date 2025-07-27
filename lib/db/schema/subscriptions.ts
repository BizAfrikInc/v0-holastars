import {
  foreignKey,
  numeric,
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { userPlans } from "@/lib/db/schema/users-plans"
export const billingCycleEnum = pgEnum("billing_cycle", ["monthly", "semi_annually", "annually"]);
export const subscriptionStatusEnum = pgEnum("hs_subscription_status", ["active", "pending", "canceled"]);

export const subscriptions = pgTable("subscriptions", {
  id: uuid("SubscriptionId").defaultRandom().primaryKey(),

  userPlanId: uuid("UserPlanId").notNull(),
  billingCycle: billingCycleEnum("billing_cycle").notNull(),
  amountPaid: numeric("AmountPaid", { precision: 10, scale: 2 }).notNull(),
  nextBillingDate: timestamp("NextBillingDat", { mode: "date" }).notNull(),
  status: subscriptionStatusEnum("SubscriptionStatus").notNull(),
  charityContribution: numeric("CharityContribution", { precision: 10, scale: 2 }),

  createdAt: timestamp("CreatedAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("UpdatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("unique_user_plan_cycle").on(table.userPlanId, table.billingCycle),
  foreignKey({
    columns: [table.userPlanId],
    foreignColumns: [userPlans.id],
    name: "fk_subscription_user_plan_id",
  }),
]);
export type Subscription = typeof subscriptions.$inferSelect;
export type NewSubscription = typeof subscriptions.$inferInsert;
