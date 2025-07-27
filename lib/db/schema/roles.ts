import {
  pgTable, serial,
  timestamp,
  varchar,
} from "drizzle-orm/pg-core"


export const roles = pgTable('hs_roles', {

  id: serial('RoleId').primaryKey(),
  name: varchar('Name', { length: 255 }).notNull(),
  createdAt: timestamp('Created_At', {mode:'date'}).defaultNow().notNull(),
  updatedAt: timestamp('Updated_At',{mode:'date'}),
})

export type Role = typeof roles.$inferSelect;
