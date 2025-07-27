import {
  foreignKey,
  pgTable, serial,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core"
import { roles } from "./roles"
import { users } from "./users"



export const usersRoles = pgTable('hs_users_roles', {
  id: uuid('UserRoleId').defaultRandom().primaryKey(),
  userId: uuid('UserId').notNull(),
  roleId: serial('RoleId').notNull(),
  createdAt: timestamp('Created_At',{mode:'date'}).defaultNow().notNull(),
  updatedAt: timestamp('Updated_At',{mode:'date'}).defaultNow().notNull(),
}, (table) => ([
  uniqueIndex('unique_user_role_idx').on(table.userId, table.roleId),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'fk_user_role_user_id ',
  }).onDelete('cascade'),
  foreignKey({
    columns: [table.roleId],
    foreignColumns: [roles.id],
    name: 'fk_user_role_role_id ',
  }).onDelete('no action')
]))

export type UsersRoles = typeof usersRoles.$inferSelect;
export type NewUserRole = typeof usersRoles.$inferInsert;
