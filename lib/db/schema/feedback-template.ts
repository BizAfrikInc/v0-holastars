import {
  boolean, pgEnum,
  pgTable,
  text,
  timestamp,
  uuid,
  varchar,
} from "drizzle-orm/pg-core"
import { TemplateQuestion } from "@/lib/db/schema/template-questions"
export const channelEnum = pgEnum('hs_feedback_channel', ['email','sms','whatsapp'])
export const feedbackTemplates = pgTable("hs_feedback_templates", {
  id: uuid("TemplateId").primaryKey().defaultRandom(),
  name: varchar("Name", { length: 255 }).notNull(),
  channel: channelEnum('Channel').default('email'),

  displayCompanyLogo: boolean("DisplayCompanyLogo").default(false).notNull(),
  companyLogo: varchar("CompanyLogo", { length: 500 }),
  displayCompanyStatement: boolean("DisplayCompanyStatement").default(false).notNull(),
  companyStatement: text("CompanyStatement"),

  createdAt: timestamp("CreatedAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("UpdatedAt", { mode: "date" }).defaultNow()
});

export type FeedbackTemplate = typeof feedbackTemplates.$inferSelect;
export type NewFeedbackTemplate = typeof feedbackTemplates.$inferInsert;

export  type FeedbackTemplateWithQuestions = FeedbackTemplate & {
  questions: TemplateQuestion[];
};
