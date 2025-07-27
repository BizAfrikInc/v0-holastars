import { count, desc, eq, inArray, sql, sum } from "drizzle-orm"
import { db } from "@/lib/db";
import { FeedbackRequest, feedbackRequests, FeedbackRequestWithTemplate, NewFeedbackRequest } from "@/lib/db/schema/feedback-requests";
import { DatabaseError } from "@/lib/errors/db-errors";
import { updateRequestSchema } from "@/lib/helpers/validation-types"
import { BaseRepository } from "./base-repository";
import { FeedbackTemplate, feedbackTemplates } from "../schema/feedback-template";
import { TemplateQuestion, templateQuestions } from "../schema/template-questions";

export class FeedbackRequestsRepository extends BaseRepository<FeedbackRequest> {
  tableName = 'hs_feedback_requests';

  async create(data: NewFeedbackRequest) {
    try{
      const [row] = await db.insert(feedbackRequests).values(data).returning()
      return row
    }catch (e) {
      this.handleError('create', e)
    }

  }

  async augmentedCreate(data: NewFeedbackRequest): Promise<FeedbackRequestWithTemplate> {
    try {
      const [inserted] = await db.insert(feedbackRequests).values(data).returning();
      if (!inserted) {
        throw new DatabaseError("Failed to insert feedback request");
      }

      let template: FeedbackTemplate | undefined;
      let questions: TemplateQuestion[] = [];

      if (inserted.templateId) {
        [template] = await db.select().from(feedbackTemplates).where(eq(feedbackTemplates.id, inserted.templateId));

        if (template) {
          questions = await db
            .select()
            .from(templateQuestions)
            .where(eq(templateQuestions.templateId, template.id));
        }
      }

      return {
        ...inserted,
        template: template ? { ...template, questions } : undefined,
      };
    } catch (e) {
      this.handleError("create", e)
    }
  }

  async findById(id: string) {
    try {
      const [row] = await db.select().from(feedbackRequests).where(eq(feedbackRequests.id, id)).limit(1)
      return row
    } catch (e) {
      this.handleError("Find By Id", e)
    }
  }

  async update(id: string, data: Partial<NewFeedbackRequest>): Promise<FeedbackRequest> {
    try {
      const validated = updateRequestSchema.parse(data)
      const [updated] = await db.update(feedbackRequests).set(validated).where(eq(feedbackRequests.id, id)).returning()
      if (!updated) throw new Error("FeedbackRequest not found")
      return updated
    } catch (e) {
      this.handleError("FeedbackRequest Update", e)
    }
  }


  async statsForBusiness(bizId: string) {
    try {
      const [row] = await db
        .select({
          total: count(),
          pending: sum(eq(feedbackRequests.status, "pending")),
          sent: sum(eq(feedbackRequests.status, "sent")),
          failed: sum(eq(feedbackRequests.status, "failed")),
          opened: sum(eq(feedbackRequests.status, "opened")),
        })
        .from(feedbackRequests)
        .where(eq(feedbackRequests.businessId, bizId))
      return row
    } catch (err) {
      this.handleError("FetchingStatsForBusiness", err)
    }
  }

  async findAll(): Promise<FeedbackRequestWithTemplate[]> {
    try {
      const requests = await db.select().from(feedbackRequests).orderBy(desc(feedbackRequests.sentAt));
      if (!requests.length) return [];

      const templateIds = Array.from(new Set(requests.map((r) => r.templateId).filter(Boolean)));
      const templates = await db.select().from(feedbackTemplates).where(inArray(feedbackTemplates.id, templateIds));

      const questionMap = new Map<string, TemplateQuestion[]>();
      if (templates.length) {
        const templateIds = templates.map((t) => t.id);
        const allQuestions = await db
          .select()
          .from(templateQuestions)
          .where(inArray(templateQuestions.templateId, templateIds));

        for (const question of allQuestions) {
          if (!questionMap.has(question.templateId)) {
            questionMap.set(question.templateId, []);
          }
          questionMap.get(question.templateId)!.push(question);
        }
      }

      return requests.map((request) => {
        const template = templates.find((t) => t.id === request.templateId);
        const questions = template ? questionMap.get(template.id) ?? [] : [];
        return {
          ...request,
          template: template ? { ...template, questions } : undefined,
        };
      });
    } catch (e) {
      this.handleError("findAll", e);
    }
  }
  async delete(id: string) {
    try {
      const [del] = await db.delete(feedbackRequests).where(eq(feedbackRequests.id, id)).returning();
      return !!del;

    }catch (error) {
      this.handleError("delete", error)
    }

  }
}

export const feedbackRequestsRepository = new FeedbackRequestsRepository();

