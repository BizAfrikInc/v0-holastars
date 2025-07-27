import { eq, sql } from "drizzle-orm"
import { createModelSchemas, db } from "@/lib/db"
import { BaseRepository } from "@/lib/db/repositories/base-repository"
import { type FeedbackTemplate, feedbackTemplates, type NewFeedbackTemplate } from "@/lib/db/schema/feedback-template"
import { templateQuestions } from "@/lib/db/schema/template-questions"
import { DatabaseError } from "@/lib/errors/db-errors"
import { CreateTemplateWithQuestionsDTO, insertTemplateQuestionSchema } from "@/lib/helpers/validation-types"
import { timestamp } from "drizzle-orm/pg-core"

const schemas = createModelSchemas("feedbackTemplates")
const insertSchema = schemas.insert.omit({ id: true });
const updateSchema = schemas.update.partial().omit({ id: true });

export class FeedbackTemplatesRepository extends BaseRepository<FeedbackTemplate> {
  tableName = "hs_feedback_templates";

  async create(data: NewFeedbackTemplate ) {
    try{
      const validated = insertSchema.parse(data);
      const [created] = await db.insert(feedbackTemplates).values(validated).returning();
      return created;

    } catch (e) {
      this.handleError('create', e)
    }
  }
  async createTemplateAndQuestions(data: CreateTemplateWithQuestionsDTO ) {
    try{
      return await db.transaction(async (trx)=>{
        const  {feedbackTemplate, feedbackTemplateQuestions } = data
        const template = insertSchema.parse(feedbackTemplate);
        const [createdFeedbackTemplate] = await db.insert(feedbackTemplates).values(template).returning();
        if(!createdFeedbackTemplate) throw new  DatabaseError('Feedback template failed to be created');
        const augmentedTemplateQuestions = feedbackTemplateQuestions.map(qn=>({...qn, templateId: createdFeedbackTemplate.id}))
        const validatedTemplateQuestions = insertTemplateQuestionSchema.parse(augmentedTemplateQuestions)
        const createdQuestions = await trx.insert(templateQuestions).values(validatedTemplateQuestions).returning();
        if(!createdQuestions)throw new  DatabaseError('Feedback template questions failed to be created');
        return { ...createdFeedbackTemplate, questions: createdQuestions };
      })

    } catch (e) {
      this.handleError('create', e)
    }
  }

  async findById(id: string) {
    try{
      const [template] = await db.select().from(feedbackTemplates).where(eq(feedbackTemplates.id, id)).limit(1);
      return template;
    }catch(e){
      this.handleError('findById', e)
    }
  }
  async findTemplateAndQuestionsById(id: string) {
    try{
      const [template] = await db.select().from(feedbackTemplates).where(eq(feedbackTemplates.id, id)).limit(1);
      if(!template) throw new  DatabaseError('Feedback template id not found');
      const questions =  await db.select().from(templateQuestions).where(eq(templateQuestions.templateId, id));
      return { template, questions }
    }catch(e){
      this.handleError('findById', e)
    }
  }

  async findAll() {
    try{
      return await db.select().from(feedbackTemplates);
    }catch (e) {
      this.handleError('findAll', e)
    }
  }

  async findAllTemplatesAndQuestions() {
    try{
      const templates  =  await db.select().from(feedbackTemplates);

      if (!templates || templates.length === 0) return new DatabaseError('Feedback template not found');
      const requests  = templates.map(async (template) => {
        const questions =  await db.select().from(templateQuestions).where(eq(templateQuestions.templateId, template.id));
       return {...template, questions};
      })
      return await Promise.all(requests)
    }catch (e) {
      this.handleError('findAll', e)
    }
  }

  async update(id: string, data: Partial<NewFeedbackTemplate>) {
    try {
      const validated = updateSchema.parse(data);
      const [updated] = await db
        .update(feedbackTemplates)
        .set({ ...validated,updatedAt: sql.raw(`now()`)})
        .where(eq(feedbackTemplates.id, id))
        .returning()
      if (!updated) throw new Error("No template found");
      return updated;
    } catch (e) {
      this.handleError('update', e)

    }

  }

  async delete(id: string) {
    try{
      const [deleted] = await db.delete(feedbackTemplates).where(eq(feedbackTemplates.id, id)).returning();
      return !!deleted;
    }catch (e) {
      this.handleError('delete', e)

    }

  }
}

export const feedbackTemplatesRepository = new FeedbackTemplatesRepository();
