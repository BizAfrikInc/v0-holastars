import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { BaseRepository } from "@/lib/db/repositories/base-repository";
import { roles } from "@/lib/db/schema/roles";

export class RolesRepository extends BaseRepository<typeof roles.$inferSelect> {
  tableName = "hs_roles";

  async findById(id: string) {
    try {
      const [result] = await db.select().from(roles).where(eq(roles.id, parseInt(id))).limit(1);
      return result;
    } catch (error) {
      this.handleError("findById", error);
    }
  }

  async findAll() {
    try {
      return await db.select().from(roles).orderBy(roles.createdAt);
    } catch (error) {
      this.handleError("findAll", error);
    }
  }

  async create(data: typeof roles.$inferInsert) {
    try {
      const [inserted] = await db.insert(roles).values(data).returning();
      return inserted;
    } catch (error) {
      this.handleError("create", error);
    }
  }

  async createMany(data: typeof roles.$inferInsert[]) {
    try {
      return await db.insert(roles).values(data).returning();
    } catch (error) {
      this.handleError("createMany", error);
    }
  }

  async update(id: string, data: Partial<typeof roles.$inferInsert>) {
    try {
      const [updated] = await db.update(roles).set(data).where(eq(roles.id, parseInt(id))).returning();
      if (!updated) {
        this.handleError("update", new Error("No rows updated"));
      }
      return updated;
    } catch (error) {
      this.handleError("update", error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db.delete(roles).where(eq(roles.id, parseInt(id))).returning({ id: roles.id });
      return !!deleted;
    } catch (error) {
      this.handleError("delete", error);
    }
  }
}

export const rolesRepository = new RolesRepository();
