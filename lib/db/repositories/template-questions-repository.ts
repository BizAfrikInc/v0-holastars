import { and, asc, eq, sql } from "drizzle-orm"
import { createModelSchemas, db } from "@/lib/db";
import { BaseRepository } from "@/lib/db/repositories/base-repository";
import { NewTemplateQuestion, TemplateQuestion, templateQuestions } from "@/lib/db/schema/template-questions";
import { insertTemplateQuestionSchema, updateTemplateQuestionSchema } from "@/lib/helpers/validation-types"

const schemas = createModelSchemas("templateQuestions");

export class TemplateQuestionsRepository extends BaseRepository<TemplateQuestion> {
  tableName = "hs_template_questions"

  async create(data: NewTemplateQuestion): Promise<TemplateQuestion | undefined> {
    try {
      const validatedData = insertTemplateQuestionSchema.parse(data)
      const [newQn] = await db.insert(templateQuestions).values(validatedData).returning()
      return newQn
    } catch (error) {
      this.handleError("create", error)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleteQn] = await db.delete(templateQuestions).where(eq(templateQuestions.id, id)).returning({ id: templateQuestions.id })
      return !!deleteQn
    } catch (error) {
      this.handleError("delete", error)
    }
  }

  async createMany(questions: NewTemplateQuestion[]) {
    const validated = questions.map((q) => schemas.insert.omit({ id: true }).parse(q))
    return await db.insert(templateQuestions).values(validated).returning()
  }

  async findAll(): Promise<TemplateQuestion[]> {
    try {
      return await db.select().from(templateQuestions).orderBy(asc(templateQuestions.questionNumber))

    }  catch (error) {
      this.handleError("findAll", error)
    }
  }

  async findById(id: string): Promise<TemplateQuestion | undefined> {
    try {
      const [templateQuestion] = await db.select().from(templateQuestions).where(eq(templateQuestions.id, id)).limit(1)
      return templateQuestion
    } catch (error) {
      this.handleError("findById", error)
    }
  }

  async findByQuestionNumber(qnNumber: number): Promise<TemplateQuestion | undefined> {
    try {
      const [templateQuestion] = await db
        .select()
        .from(templateQuestions)
        .where(eq(templateQuestions.questionNumber, qnNumber))
        .limit(1)
      return templateQuestion
    } catch (error) {
      this.handleError("findById", error)
    }
  }

  async findByTemplateId(templateId: string) {
    try {
      return await db
        .select()
        .from(templateQuestions)
        .where(eq(templateQuestions.templateId, templateId))
        .orderBy(asc(templateQuestions.questionNumber))

    } catch (error) {
      this.handleError("findByTemplateId", error)
    }

  }

  async update(id: string, data: Partial<NewTemplateQuestion>): Promise<TemplateQuestion> {
    try {
      const validatedData = updateTemplateQuestionSchema.parse(data)
      const [updatedQn] = await db
        .update(templateQuestions)
        .set({ ...validatedData, updatedAt: sql.raw(`now()`)})
        .where(eq(templateQuestions.id, id))
        .returning()

      if (!updatedQn) {
        this.handleError("update", new Error("No rows updated"))
      }

      return updatedQn
    } catch (error) {
      this.handleError("update", error)
    }
  }

  async deleteByTemplateId(templateId: string): Promise<boolean> {
    try {
      const deleted = await db.delete(templateQuestions).where(eq(templateQuestions.templateId, templateId)).returning()
      return deleted.length > 0

    } catch (e) {
      this.handleError("delete", e)

    }

  }
}

export const templateQuestionsRepository = new TemplateQuestionsRepository();
