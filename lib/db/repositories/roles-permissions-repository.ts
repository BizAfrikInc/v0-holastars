import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { NewRolePermission, RolePermission, rolesPermissions } from "@/lib/db/schema/roles-permissions";
import { BaseRepository } from "./base-repository";

export class RolePermissionRepository extends BaseRepository<RolePermission> {
  tableName = "hs_roles_permissions";

  async findById(id: string): Promise<RolePermission | undefined> {
    try {
      const [result] = await db.select().from(rolesPermissions).where(eq(rolesPermissions.id, id)).limit(1);
      return result;
    } catch (error) {
      this.handleError("findById", error);
    }
  }

  async findAll(): Promise<RolePermission[]> {
    try {
      return await db.select().from(rolesPermissions);
    } catch (error) {
      this.handleError("findAll", error);
    }
  }

  async create(data: NewRolePermission): Promise<RolePermission | undefined> {
    try {
      const [result] = await db.insert(rolesPermissions).values(data).returning();
      return result;
    } catch (error) {
      this.handleError("create", error);
    }
  }

  async createMany(data: NewRolePermission[]): Promise<RolePermission[]> {
    try {
      return await db.insert(rolesPermissions).values(data).returning();
    } catch (error) {
      this.handleError("createMany", error);
    }
  }

  async update(id: string, data: Partial<NewRolePermission>): Promise<RolePermission> {
    try {
      const [updated] = await db.update(rolesPermissions).set(data).where(eq(rolesPermissions.id, id)).returning();
      if (!updated) throw new Error("No record updated");
      return updated;
    } catch (error) {
      this.handleError("update", error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db.delete(rolesPermissions).where(eq(rolesPermissions.id, id)).returning({ id: rolesPermissions.id });
      return !!deleted;
    } catch (error) {
      this.handleError("delete", error);
    }
  }
}

export const rolePermissionRepository = new RolePermissionRepository();
