import {
  boolean,
  foreignKey,
  pgTable, serial,
  timestamp, uniqueIndex, uuid,
} from "drizzle-orm/pg-core"
import { permissions } from "./permissions";
import { users } from "./users";

export const usersPermissions = pgTable(
  "hs_users_permissions",
  {
    id: uuid("UserPermissionId").primaryKey().defaultRandom(),
    userId: uuid("UserId").notNull(),
    permissionId: serial("PermissionId").notNull(),
    granted: boolean("Granted").notNull().default(true),
    createdAt: timestamp("Created_AT", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("Updated_At", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => ([
    uniqueIndex("unique_user_permission_idx").on(table.userId, table.permissionId),
    foreignKey(({
      columns: [table.userId],
      foreignColumns: [users.id],
      name: "fk_user_permission_user_id",
    })).onDelete("cascade"),
    foreignKey(({
      columns: [table.permissionId],
      foreignColumns: [permissions.id],
      name: "fk_user_permission_permission_id",
    })).onDelete('no action')
  ])
);

export type UserPermission = typeof usersPermissions.$inferSelect;
export type NewUserPermission = typeof usersPermissions.$inferInsert;
