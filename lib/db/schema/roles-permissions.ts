import {
  foreignKey, pgTable,
  serial,
  timestamp, uniqueIndex, uuid,
} from "drizzle-orm/pg-core"
import { permissions } from "./permissions";
import { roles } from "./roles";

export const rolesPermissions = pgTable(
  "hs_roles_permissions",
  {
    id: uuid("RolePermissionId").primaryKey().defaultRandom(),
    roleId: serial('RoleId').notNull(),
    permissionId: serial('PermissionId').notNull(),
    createdAt: timestamp("Created_At", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("Updated_At", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ([
    uniqueIndex("unique_role_permission_idx").on(table.roleId, table.permissionId),
    foreignKey({
      columns: [table.roleId],
      foreignColumns: [roles.id],
      name: "fk_role_permission_role_id",
    }).onDelete("cascade"),
    foreignKey({
      columns: [table.permissionId],
      foreignColumns: [permissions.id],
      name: "fk_role_permission_permission_id",
    }).onDelete('no action')
  ])
);

export type RolePermission = typeof rolesPermissions.$inferSelect;
export type NewRolePermission = typeof rolesPermissions.$inferInsert;
