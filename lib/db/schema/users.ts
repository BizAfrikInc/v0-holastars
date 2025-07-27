import {
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar
} from 'drizzle-orm/pg-core';

export const statusEnum = pgEnum('hs_status', ['active', 'inactive', 'pending']);

export const users = pgTable('hs_users', {
  id: uuid('UserId').defaultRandom().primaryKey(),
  email: varchar('Email', { length: 255 }).notNull(),
  firstName: varchar('FirstName', { length: 255 }).notNull(),
  lastName: varchar('LastName', { length: 255 }).notNull(),
  username: varchar('Username', { length: 255 }).notNull(),
  image: varchar('Image', { length: 255 }),
  provider: varchar('Provider', { length: 255 }),
  passwordHash: varchar('PasswordHash', { length: 255 }),
  status: statusEnum('Status').default('pending'),
  createdAt: timestamp('Created_At', {mode: "date"}).defaultNow().notNull(),
  updatedAt: timestamp('Updated_At', {mode: "date"})
}, (table) => ([
  uniqueIndex('unique_email_idx').on(table.email)
]));

export type User = typeof users.$inferSelect;
export type NewUser = typeof users.$inferInsert;


