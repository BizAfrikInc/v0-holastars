import { boolean, pgEnum, pgTable, text, timestamp, uuid, varchar } from "drizzle-orm/pg-core"
import { businesses } from "./businesses"

export const platformEnum = pgEnum("hs_social_platform", ["google_business", "facebook", "yelp"])

export const socialMediaConnections = pgTable("hs_social_media_connections", {
  id: uuid("ConnectionId").defaultRandom().primaryKey(),
  businessId: uuid("BusinessId")
    .references(() => businesses.id, { onDelete: "cascade" })
    .notNull(),
  platform: platformEnum("Platform").notNull(),
  platformAccountId: varchar("PlatformAccountId", { length: 255 }).notNull(),
  platformAccountName: varchar("PlatformAccountName", { length: 255 }).notNull(),
  accessToken: text("AccessToken").notNull(),
  refreshToken: text("RefreshToken"),
  tokenExpiresAt: timestamp("TokenExpiresAt", { mode: "date" }),
  isActive: boolean("IsActive").default(true),
  autoPostEnabled: boolean("AutoPostEnabled").default(false),
  minRatingThreshold: varchar("MinRatingThreshold", { length: 10 }).default("4"),
  createdAt: timestamp("Created_At", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("Updated_At", { mode: "date" }),
})

export type SocialMediaConnection = typeof socialMediaConnections.$inferSelect
export type NewSocialMediaConnection = typeof socialMediaConnections.$inferInsert
