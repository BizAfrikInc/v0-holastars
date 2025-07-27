import {
  foreignKey, 
  pgEnum,
  pgTable,
  timestamp,
  uniqueIndex,
  uuid,
  varchar,
} from "drizzle-orm/pg-core";

import { businesses }   from "./businesses";
export const customerStatusEnum = pgEnum("hs_customer_status", ["active", "inactive"]);

export const customers = pgTable(
  "hs_customers",
  {
    id: uuid("CustomerId").primaryKey().defaultRandom(),
    businessId:   uuid("BusinessId").notNull(),
    customerName: varchar("CustomerName", { length: 255 }).notNull(),
    email:     varchar("Email",      { length: 255 }).notNull(),
    phoneNumber:  varchar("PhoneNumber", { length: 50 }), 
    status: customerStatusEnum("CustomerStatus").default("active").notNull(),
    createdAt: timestamp("CreatedAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("UpdatedAt", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("unique_customer_email_business").on(table.businessId, table.email),
    foreignKey({
      columns: [table.businessId],
      foreignColumns: [businesses.id],
      name: "fk_customers_business_id",
    }).onDelete('cascade'),
  ]
);

export type Customer     = typeof customers.$inferSelect;
export type NewCustomer  = typeof customers.$inferInsert;
