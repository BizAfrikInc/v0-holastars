import { foreignKey, pgTable, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { users } from "./users";

export const verificationTokens = pgTable("hs_verification_tokens", {
  id: uuid("TokenId").defaultRandom().primaryKey(),
  userId: uuid("UserId").notNull(),
  token: varchar("Token", { length: 256 }).notNull(),
  expiresAt: timestamp("Expires_At", { mode: "date" }).notNull(),
  createdAt: timestamp("Created_At", { mode: "date" }).defaultNow(),
}, (table) =>([
  foreignKey({
    columns: [table.userId],
    foreignColumns: [users.id],
    name: "fk_verification_tokens_user_id",
  }),
]));

export type VerificationToken = typeof verificationTokens.$inferSelect;
export type NewVerificationToken = typeof verificationTokens.$inferInsert;
