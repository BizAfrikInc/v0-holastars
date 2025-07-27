import { eq } from "drizzle-orm";
import { createModelSchemas, db } from "@/lib/db"
import { BaseRepository } from "@/lib/db/repositories/base-repository";
import { NewPlanPermission, PlanPermission, planPermissions } from "@/lib/db/schema/plans-permission"

const schema = createModelSchemas("planPermissions");
const insertSchema = schema.insert.omit({ id: true });
const updateSchema = schema.update.partial().omit({ id: true });

export class PlanPermissionsRepository extends BaseRepository<PlanPermission> {
  tableName = "plan_permissions";

  async create(data: NewPlanPermission): Promise<PlanPermission | undefined> {
    try {
      const validated = insertSchema.parse(data);
      const [created] = await db.insert(planPermissions).values(validated).returning();
      return created;
    } catch (error) {
      this.handleError("create", error);
    }
  }

  async findById(id: string): Promise<PlanPermission | undefined> {
    try {
      const [item] = await db.select().from(planPermissions).where(eq(planPermissions.id, id)).limit(1);
      return item;
    } catch (error) {
      this.handleError("findById", error);
    }
  }

  async findAll(): Promise<PlanPermission[]> {
    try {
      return await db.select().from(planPermissions);
    } catch (error) {
      this.handleError("findAll", error);
    }
  }

  async update(id: string, data: Partial<NewPlanPermission>): Promise<PlanPermission> {
    try {
      const validated = updateSchema.parse(data);
      const [updated] = await db.update(planPermissions).set(validated).where(eq(planPermissions.id, id)).returning();
      if (!updated) throw new Error("No record updated");
      return updated;
    } catch (error) {
      this.handleError("update", error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db.delete(planPermissions).where(eq(planPermissions.id, id)).returning({ id: planPermissions.id });
      return !!deleted;
    } catch (error) {
      this.handleError("delete", error);
    }
  }
}

export const planPermissionsRepository = new PlanPermissionsRepository();
