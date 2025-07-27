import {
  foreignKey,
  pgTable,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { customers } from "@/lib/db/schema/customers"
import { feedbackRequests } from "@/lib/db/schema/feedback-requests"

export const feedbackResponses = pgTable("hs_feedback_responses", {
  id: uuid("FeedbackResponseId").defaultRandom().primaryKey(),

  feedbackRequestId: uuid("FeedbackRequestId").notNull(),
  customerId:        uuid("CustomerId").notNull(),

  submittedAt: timestamp("SubmittedAt", { mode: "date" }).defaultNow().notNull(),

  createdAt: timestamp("CreatedAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("UpdatedAt", { mode: "date" }).defaultNow().notNull(),
}, (t) => [
  foreignKey({ columns: [t.feedbackRequestId], foreignColumns: [feedbackRequests.id] }).onDelete("cascade"),
  foreignKey({ columns: [t.customerId],        foreignColumns: [customers.id]}).onDelete("cascade"),
]);

export type FeedbackResponse     = typeof feedbackResponses.$inferSelect;
export type NewFeedbackResponse  = typeof feedbackResponses.$inferInsert;
