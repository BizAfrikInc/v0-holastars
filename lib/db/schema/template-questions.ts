import {
  boolean,
  foreignKey,
  pgEnum,
  pgTable,
  serial, text, timestamp, uuid,
} from "drizzle-orm/pg-core"
import { feedbackTemplates } from "@/lib/db/schema/feedback-template"

export const fieldTypeEnum = pgEnum('hs_input_types', ['input', 'textarea','radio','checkbox'])

export const templateQuestions = pgTable("hs_template_questions", {
  id: uuid("TemplateQuestionId").defaultRandom().primaryKey(),
  templateId: uuid("TemplateId").notNull(),
  questionNumber: serial("QuestionNumber").notNull(),
  questionText: text("QuestionText").notNull(),
  inputFieldType: fieldTypeEnum('FieldType').default('input'),
  options: text("Options").array(),
  isRequired: boolean("IsRequired").default(false).notNull(),
  createdAt: timestamp("CreatedAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("UpdatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.templateId],
    foreignColumns: [feedbackTemplates.id],
    name: "fk_template_question_template_id",
  }).onDelete('cascade'),
]);

export type TemplateQuestion = typeof templateQuestions.$inferSelect;
export type NewTemplateQuestion = typeof templateQuestions.$inferInsert;
