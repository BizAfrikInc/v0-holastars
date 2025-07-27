import { count, eq, sql, sum } from "drizzle-orm"
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema/customers";
import { FeedbackResponse, feedbackResponses, NewFeedbackResponse } from "@/lib/db/schema/feedback-response"
import { updateResponseSchema } from "@/lib/helpers/validation-types"
import { BaseRepository } from "./base-repository";

export class FeedbackResponsesRepository extends BaseRepository<FeedbackResponse> {
  tableName = "hs_feedback_responses";

  async create(data: NewFeedbackResponse) {
    try{
      const [row] = await db.insert(feedbackResponses).values(data).returning();
      return row;
      
    }catch (e) {
      this.handleError('create', e)
      
    }

  }

  async countForBusiness(bizId: string) {
    try{
      const [row] = await db
        .select({ total: count() })
        .from(feedbackResponses)
        .innerJoin(customers, eq(customers.id, feedbackResponses.customerId))
        .where(eq(customers.businessId, bizId));
      return Number(row?.total ?? 0);
      
    }catch(e){
      this.handleError('countForBusiness', e)
    }
  }
  
  async findById(id: string) {
    try {
      const [row] = await db.select().from(feedbackResponses).where(eq(feedbackResponses.id, id)).limit(1)
      return row
    } catch (e) {
      this.handleError("Find By Id", e)
    }
  }

  async update(id: string, data: Partial<NewFeedbackResponse>): Promise<FeedbackResponse> {
    try {
      const validated = updateResponseSchema.parse(data)
      const [updated] = await db.update(feedbackResponses).set(validated).where(eq(feedbackResponses.id, id)).returning()
      if (!updated) throw new Error("Feedback Response not found")
      return updated
    } catch (e) {
      this.handleError("FeedbackResponse Update", e)
    }
  }
  

  async findAll() {
    try {
      return await db.select().from(feedbackResponses)
    } catch (e) {
      this.handleError("findAll", e)
    }
  }
  async delete(id: string) {
    try {
      const [del] = await db.delete(feedbackResponses).where(eq(feedbackResponses.id, id)).returning();
      return !!del;

    }catch (error) {
      this.handleError("delete", error)
    }

  }
}

export const feedbackResponsesRepository = new FeedbackResponsesRepository();
