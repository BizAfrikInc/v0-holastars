import { sql } from "drizzle-orm";
import {
  foreignKey,
  pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { businesses } from "@/lib/db/schema/businesses"
import { departments } from "@/lib/db/schema/departments"
import { channelEnum, FeedbackTemplate, feedbackTemplates } from "@/lib/db/schema/feedback-template"
import { locations } from "@/lib/db/schema/locations"
import { users } from "@/lib/db/schema/users"
import { TemplateQuestion } from "./template-questions";


export const feedbackReqStatusEnum = pgEnum(
  "feedback_req_status",
  ["pending", "sent", "failed", "opened"]
);

export const feedbackRequests = pgTable("hs_feedback_requests", {
  id: uuid("FeedbackRequestId").defaultRandom().primaryKey(),
  businessId:   uuid("BusinessIdd").notNull(),
  locationId:   uuid("LocationId"),
  departmentId: uuid("DepartmentId"),
  channel: channelEnum("Channel").default("email").notNull(),
  templateId: uuid("TemplateId").notNull(),
  requesterId: uuid("RequesterId").notNull(),
  customerIds: text('CustomerIds')
      .array()
      .notNull()
      .default(sql`ARRAY[]::text[]`),   
  status: feedbackReqStatusEnum("status").default("pending").notNull(),
  sentAt: timestamp("SentAt", { mode: "string" }),
  createdAt: timestamp("CreatedAt", { mode: "string" }).defaultNow().notNull(),
  updatedAt: timestamp("UpdatedAt", { mode: "string" }),
}, (t) => [
  foreignKey({ columns: [t.businessId],   foreignColumns: [businesses.id] }).onDelete('cascade'),
  foreignKey({ columns: [t.locationId],   foreignColumns: [locations.id]}).onDelete(('set null')),
  foreignKey({ columns: [t.departmentId], foreignColumns: [departments.id]}).onDelete('set null'),
  foreignKey({ columns: [t.templateId],   foreignColumns: [feedbackTemplates.id]}).onDelete('set null'),
  foreignKey({ columns: [t.requesterId],  foreignColumns: [users.id]}).onDelete(('set null')),
]);

export type FeedbackRequest     = typeof feedbackRequests.$inferSelect;
export type NewFeedbackRequest  = typeof feedbackRequests.$inferInsert;
export type FeedbackRequestWithTemplate = FeedbackRequest & {
  template?: FeedbackTemplate & { questions: TemplateQuestion[] };
};