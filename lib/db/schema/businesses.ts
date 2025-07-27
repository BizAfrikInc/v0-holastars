import {
  foreignKey,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { users } from "@/lib/db/schema/users"


export const businesses = pgTable('hs_businesses', {
  id: uuid('BusinessId').defaultRandom().primaryKey(),
  userId: uuid().notNull(),
  email: varchar('Email', { length: 255 }).notNull(),
  name: varchar('BusinessName', { length: 255 }).notNull(),
  createdAt: timestamp('Created_At', {mode: "date"}).defaultNow().notNull(),
  updatedAt: timestamp('Updated_At', {mode: "date"})
}, (table) => ([
  uniqueIndex('unique_business_email_idx').on(table.email),
  uniqueIndex('unique_business_name_idx').on(table.name),
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: 'fk_user_business_user_id'
  }).onDelete('cascade')
]));

export type Business = typeof businesses.$inferSelect;
export type NewBusiness = typeof businesses.$inferInsert;


