import {
  foreignKey,
  pgTable, serial,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"

import { permissions } from "@/lib/db/schema/permissions";
import { plans } from "@/lib/db/schema/plans";

export const planPermissions = pgTable("plan_permissions", {
  id: uuid("PlanPermissionId").defaultRandom().primaryKey(),

  planId: uuid("PlanId").notNull(),
  permissionId: serial("PermissionId").notNull(),

  createdAt: timestamp("CreatedAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("UpdatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  uniqueIndex("unique_plan_permission").on(table.planId, table.permissionId),
  foreignKey({
    columns: [table.planId],
    foreignColumns: [plans.id],
    name: "fk_planpermissions_plan_id",
  }).onDelete("cascade"),
  foreignKey({
    columns: [table.permissionId],
    foreignColumns: [permissions.id],
    name: "fk_planpermissions_permission_id",
  }).onDelete("no action"),
]);

export type PlanPermission = typeof planPermissions.$inferSelect;
export type NewPlanPermission = typeof planPermissions.$inferInsert;
