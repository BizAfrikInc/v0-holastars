import { foreignKey, pgTable, timestamp, uniqueIndex, uuid, varchar } from "drizzle-orm/pg-core"
import { businesses } from "./businesses";
import { Department } from "./departments";

export const locations = pgTable("hs_locations", {
  id: uuid("LocationId").primaryKey().defaultRandom(),
  businessId: uuid("BusinessId").notNull(),
  name: varchar("Name", { length: 255 }).notNull(),
  address: varchar("Address", { length: 500 }).notNull(),
  phoneNumber: varchar("PhoneNumber", { length: 255 }),
  email: varchar("Email", { length: 255 }),
  createdAt: timestamp("Created_At", {mode: 'date'}).notNull().defaultNow(),
  updatedAt: timestamp("Updated_At", {mode: 'date'}),
}, (table)=>([
  foreignKey({
    columns: [table.businessId],
    foreignColumns: [businesses.id],
    name: "fk_business_location_business_id"
  }).onDelete("cascade"),
  uniqueIndex('unique_location_address_idx').on(table.address),

]));

export type Location = typeof locations.$inferSelect;
export type NewLocation = typeof locations.$inferInsert;
export  type LocationWithDepartments = {
  location: Location;
  departments:  Department[];
}
