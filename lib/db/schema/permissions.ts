import {
  pgTable, serial,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { locations } from "@/lib/db/schema/locations"

export const permissions = pgTable('hs_permissions', {
  id: serial('PermissionId').notNull().primaryKey(),
  name: varchar('Name', { length: 255 }).notNull(),
  module: varchar('Module', { length: 255 }).notNull(),
  action: varchar('Action', { length: 255 }).notNull(),
  createdAt: timestamp('Created_At', {mode: 'date'}).defaultNow().notNull(),
  updatedAt: timestamp('Updated_At', {mode: 'date'}),
});

export type Permission = typeof permissions.$inferSelect;
export type NewPermission = typeof permissions.$inferInsert;