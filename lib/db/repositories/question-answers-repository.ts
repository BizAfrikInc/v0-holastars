import { count, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { customers } from "@/lib/db/schema/customers";
import {
  NewQuestionAnswer,
  QuestionAnswer,
  questionAnswers,
} from "@/lib/db/schema/question-answers";
import { updateAnswerSchema } from "@/lib/helpers/validation-types"
import { BaseRepository } from "./base-repository";

export class QuestionAnswersRepository extends BaseRepository<QuestionAnswer> {
  tableName = "hs_question_answers";

  async create(ans: NewQuestionAnswer) {
    const [row] = await db.insert(questionAnswers).values(ans).returning();
    return row;
  }

  async createMany(data: NewQuestionAnswer[]) {
    try{
      return await db.insert(questionAnswers).values(data).returning();

    }catch (error){
      this.handleError("createMany", error);

    }
  }

  async findById(id: string) {
    const [row] = await db.select().from(questionAnswers).where(eq(questionAnswers.id, id)).limit(1);
    return row;
  }

  async findAll() {
    try{
      return await db.select().from(questionAnswers);
    } catch (e) {
      this.handleError("findAll", e);
    }
  }


  async update(id: string, data: Partial<NewQuestionAnswer>): Promise<QuestionAnswer> {
    try {
      const validatedData = updateAnswerSchema.parse(data)
      const [updatedAnswer] = await db.update(questionAnswers).set(validatedData).where(eq(questionAnswers.id, id)).returning()

      if (!updatedAnswer) {
        this.handleError("update", new Error("No rows updated"))
      }
      return updatedAnswer
    } catch (error) {
      this.handleError("update", error)
    }
  }

  async delete(id: string) {
    try {
      const [del] = await db.delete(questionAnswers).where(eq(questionAnswers.id, id)).returning();
      return !!del;

    }catch (error) {
      this.handleError("delete", error)
    }

  }
  
  async countForBusiness(businessId: string) {
    try {
      const [row] = await db
        .select({ total: count()})
        .from(questionAnswers)
        .innerJoin(customers, eq(customers.id, questionAnswers.customerId))
        .where(eq(customers.businessId, businessId));
      return Number(row?.total ?? 0);

    } catch (e) {
      this.handleError("countForBusiness", e)

    }
  }
}

export const questionAnswersRepository = new QuestionAnswersRepository();
