import {
  foreignKey,
  pgTable,
  serial,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

import { customers } from "@/lib/db/schema/customers"
import { templateQuestions } from "./template-questions";

export const questionAnswers = pgTable("hs_question_answers", {
  id: uuid("QuestionAnswerId").defaultRandom().primaryKey(),
  templateQuestionId: uuid("TemplateQuestionId").notNull(),
  customerId: uuid("CustomerId").notNull(),
  answer: text("answer").notNull(),
  createdAt: timestamp("CreatedAt", { mode: "date" }).defaultNow().notNull(),
  updatedAt: timestamp("UpdatedAt", { mode: "date" }).defaultNow().notNull(),
}, (table) => [
  foreignKey({
    columns: [table.customerId],
    foreignColumns: [customers.id],
    name: "fk_answers_customer",
  }).onDelete('cascade'),
  foreignKey({
    columns: [table.templateQuestionId],
    foreignColumns: [templateQuestions.id],
    name: "fk_answers_template_question",
  }).onDelete('cascade'),
]);

export type QuestionAnswer     = typeof questionAnswers.$inferSelect;
export type NewQuestionAnswer  = typeof questionAnswers.$inferInsert;
