import {
  boolean,
  foreignKey,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

import { plans } from "@/lib/db/schema/plans";
import { users } from "@/lib/db/schema/users";

export const userPlans = pgTable("user_plans", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: uuid("user_id").notNull(),
  planId: uuid("plan_id").notNull(),
  isActive: boolean("is_active").default(true).notNull(),
  createdAt: timestamp("created_at", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("updated_at", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("unique_user_plan").on(table.userId, table.planId),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "fk_user_plans_user_id"
  }),
  foreignKey({
    columns: [table.planId],
    foreignColumns: [plans.id],
    name: "fk_user_plans_plan_id"
  }),
]);

export type UserPlan = typeof userPlans.$inferSelect;
export type NewUserPlan = typeof userPlans.$inferInsert;
