import { eq } from "drizzle-orm";
import { createModelSchemas, db } from "@/lib/db";
import { BaseRepository } from "@/lib/db/repositories/base-repository";
import { NewPlan, Plan, plans } from "@/lib/db/schema/plans";

const planSchemas = createModelSchemas("plans");
const insertPlanSchema = planSchemas.insert.omit({ id: true });
const updatePlanSchema = planSchemas.update.partial().omit({ id: true });

export class PlansRepository extends BaseRepository<Plan> {
  tableName = "plans";

  async create(data: NewPlan): Promise<Plan | undefined> {
    try {
      const validated = insertPlanSchema.parse(data);
      const [created] = await db.insert(plans).values(validated).returning();
      return created;
    } catch (error) {
      this.handleError("create", error);
    }
  }

  async findById(id: string): Promise<Plan | undefined> {
    try {
      const [plan] = await db.select().from(plans).where(eq(plans.id, id)).limit(1);
      return plan;
    } catch (error) {
      this.handleError("findById", error);
    }
  }

  async findAll(): Promise<Plan[]> {
    try {
      return await db.select().from(plans);
    } catch (error) {
      this.handleError("findAll", error);
    }
  }

  async update(id: string, data: Partial<NewPlan>): Promise<Plan> {
    try {
      const validated = updatePlanSchema.parse(data);
      const [updated] = await db.update(plans).set(validated).where(eq(plans.id, id)).returning();
      if (!updated) throw new Error("Plan not found");
      return updated;
    } catch (error) {
      this.handleError("update", error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db.delete(plans).where(eq(plans.id, id)).returning({ id: plans.id });
      return !!deleted;
    } catch (error) {
      this.handleError("delete", error);
    }
  }

  async findByName(name: string): Promise<Plan | undefined> {
    try {
      const [plan] = await db.select().from(plans).where(eq(plans.name, name)).limit(1);
      return plan;
    } catch (error) {
      this.handleError("findByName", error);
    }
  }
}

export const planRepository = new PlansRepository();
