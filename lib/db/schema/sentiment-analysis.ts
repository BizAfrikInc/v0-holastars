import { foreignKey, pgEnum, pgTable, real, text, timestamp, uuid } from "drizzle-orm/pg-core"
import { questionAnswers } from "@/lib/db/schema/question-answers"

export const sentimentEnum = pgEnum("sentiment_type", ["positive", "negative", "neutral"])

export const sentimentAnalysis = pgTable(
  "hs_sentiment_analysis",
  {
    id: uuid("SentimentAnalysisId").defaultRandom().primaryKey(),
    questionAnswerId: uuid("QuestionAnswerId").notNull(),
    sentiment: sentimentEnum("sentiment").notNull(),
    confidence: real("confidence").notNull(), // 0-1 confidence score
    keywords: text("keywords").array(), // Key phrases/words that influenced sentiment
    summary: text("summary"), // Brief summary of the sentiment analysis
    createdAt: timestamp("CreatedAt", { mode: "date" }).defaultNow().notNull(),
    updatedAt: timestamp("UpdatedAt", { mode: "date" }).defaultNow().notNull(),
  },
  (table) => [
    foreignKey({
      columns: [table.questionAnswerId],
      foreignColumns: [questionAnswers.id],
      name: "fk_sentiment_question_answer",
    }).onDelete("cascade"),
  ],
)

export type SentimentAnalysis = typeof sentimentAnalysis.$inferSelect
export type NewSentimentAnalysis = typeof sentimentAnalysis.$inferInsert
