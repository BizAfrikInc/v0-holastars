import { and, eq } from "drizzle-orm";
import { createModelSchemas, db } from "@/lib/db";
import { BaseRepository } from "@/lib/db/repositories/base-repository";
import { NewUserPlan, UserPlan, userPlans } from "@/lib/db/schema/users-plans"

const schemas = createModelSchemas("userPlans");

const insertSchema = schemas.insert.omit({ id: true });
const updateSchema = schemas.update.partial().omit({ id: true });

export class UserPlansRepository extends BaseRepository<UserPlan> {
  tableName = "user_plans";

  async create(data: NewUserPlan): Promise<UserPlan | undefined> {
    try {
      const validated = insertSchema.parse(data);
      const [created] = await db.insert(userPlans).values(validated).returning();
      return created;
    } catch (error) {
      this.handleError("create", error);
    }
  }

  async findById(id: string): Promise<UserPlan | undefined> {
    try {
      const [result] = await db.select().from(userPlans).where(eq(userPlans.id, id)).limit(1);
      return result;
    } catch (error) {
      this.handleError("findById", error);
    }
  }

  async findAll(): Promise<UserPlan[]> {
    try {
      return await db.select().from(userPlans);
    } catch (error) {
      this.handleError("findAll", error);
    }
  }

  async findByUserAndPlan(userId: string, planId: string): Promise<UserPlan | undefined> {
    try {
      const [result] = await db.select().from(userPlans)
        .where(and(eq(userPlans.userId, userId), eq(userPlans.planId, planId)))
        .limit(1);
      return result;
    } catch (error) {
      this.handleError("findByUserAndPlan", error);
    }
  }

  async update(id: string, data: Partial<NewUserPlan>): Promise<UserPlan> {
    try {
      const validated = updateSchema.parse(data);
      const [updated] = await db.update(userPlans).set(validated).where(eq(userPlans.id, id)).returning();
      if (!updated) throw new Error("UserPlan not found");
      return updated;
    } catch (error) {
      this.handleError("update", error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db.delete(userPlans).where(eq(userPlans.id, id)).returning({ id: userPlans.id });
      return !!deleted;
    } catch (error) {
      this.handleError("delete", error);
    }
  }
}

export const userPlansRepository = new UserPlansRepository();
