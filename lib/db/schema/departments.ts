import { foreignKey, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { locations } from "./locations";

export const departments = pgTable("hs_departments", {
  id: uuid("DepartmentId").primaryKey().defaultRandom(),
  locationId: uuid("LocationId").notNull(),
  name: varchar("Name", { length: 255 }).notNull(),
  description: varchar("Description", { length: 255 }),
  createdAt: timestamp("Created_At", {mode: 'date'}).notNull().defaultNow(),
  updatedAt: timestamp("Updated_At", {mode: 'date'}),
}, (table) => ([
  foreignKey({
    columns: [table.locationId],
    foreignColumns: [locations.id],
    name: "fk_department_location_location_id"

  }).onDelete('cascade')
]));

export type Department = typeof departments.$inferSelect;
export type NewDepartment = typeof departments.$inferInsert;
