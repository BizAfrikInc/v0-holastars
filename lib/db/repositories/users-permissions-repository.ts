import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { NewUserPermission, UserPermission, usersPermissions } from "@/lib/db/schema/users-permissions";
import { BaseRepository } from "./base-repository";

export class UserPermissionRepository extends BaseRepository<UserPermission> {
  tableName = "hs_users_permissions";

  async findById(id: string): Promise<UserPermission | undefined> {
    try {
      const [result] = await db.select().from(usersPermissions).where(eq(usersPermissions.id, id)).limit(1);
      return result;
    } catch (error) {
      this.handleError("findById", error);
    }
  }

  async findAll(): Promise<UserPermission[]> {
    try {
      return await db.select().from(usersPermissions);
    } catch (error) {
      this.handleError("findAll", error);
    }
  }

  async create(data: NewUserPermission): Promise<UserPermission | undefined> {
    try {
      const [result] = await db.insert(usersPermissions).values(data).returning();
      return result;
    } catch (error) {
      this.handleError("create", error);
    }
  }

  async createMany(data: NewUserPermission[]): Promise<UserPermission[]> {
    try {
      return await db.insert(usersPermissions).values(data).returning();
    } catch (error) {
      this.handleError("createMany", error);
    }
  }

  async update(id: string, data: Partial<NewUserPermission>): Promise<UserPermission> {
    try {
      const [updated] = await db.update(usersPermissions).set(data).where(eq(usersPermissions.id, id)).returning();
      if (!updated) throw new Error("No record updated");
      return updated;
    } catch (error) {
      this.handleError("update", error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db.delete(usersPermissions).where(eq(usersPermissions.id, id)).returning({ id: usersPermissions.id });
      return !!deleted;
    } catch (error) {
      this.handleError("delete", error);
    }
  }
}

export const userPermissionRepository = new UserPermissionRepository();
