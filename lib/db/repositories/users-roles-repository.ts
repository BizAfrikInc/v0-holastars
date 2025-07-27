import { eq } from "drizzle-orm"
import { createModelSchemas, db } from "@/lib/db"
import { BaseRepository } from "@/lib/db/repositories/base-repository"
import { roles } from "@/lib/db/schema/roles"
import { users } from "@/lib/db/schema/users"
import { NewUserRole, UsersRoles, usersRoles } from "@/lib/db/schema/users-roles"

const userRoleSchemas = createModelSchemas("usersRoles")


const updateUserRolesSchema = userRoleSchemas.update.partial().omit({ id: true });
const insertUserRolesSchema = userRoleSchemas.insert.omit({ id: true });
export class UsersRolesRepository extends BaseRepository<UsersRoles> {
  tableName: string = "usersRoles"
  async create(data: NewUserRole): Promise<UsersRoles | undefined> {
    try {
      const validatedData = insertUserRolesSchema.parse(data)
      const [createdRole] = await db.insert(usersRoles).values(validatedData).returning()
      return createdRole
    } catch (error) {
      this.handleError("create", error)
    }
  }

  async createMany(data: NewUserRole[]): Promise<UsersRoles[]> {
    try {
      const validatedData = data.map((user) => insertUserRolesSchema.parse(user))
      return await db.insert(usersRoles).values(validatedData).returning()
    } catch (error) {
      console.error("Error creating multiple user roles:", error)
      throw error
    }
  }

  async findById(id: string): Promise<UsersRoles | undefined> {
    try {
      const [role] = await db.select().from(usersRoles).where(eq(usersRoles.id, id))
      return role
    } catch (error) {
      console.error("Error finding user role by ID:", error)
      throw error
    }
  }


  async findAll(): Promise<UsersRoles[]> {
    try {
      return await db.select().from(usersRoles).orderBy(usersRoles.createdAt)
    } catch (error) {
      this.handleError("Error finding all user roles:", error)
    }
  }

  async update(id: string, data: Partial<NewUserRole>): Promise<UsersRoles> {
    try {
      const validatedData = updateUserRolesSchema.parse(data)
      const [updatedUserRoles] = await db.update(usersRoles).set(validatedData).where(eq(usersRoles.id, id)).returning()

      if (!updatedUserRoles) {
        this.handleError("update", new Error("No rows updated"))
      }

      return updatedUserRoles
    } catch (error) {
      this.handleError("update", error)
    }
  }


  async delete(id: string) {
    try {
      const [deletedRole] = await db.delete(usersRoles).where(eq(usersRoles.id, id)).returning()
      return !!deletedRole
    } catch (error) {
      this.handleError("Error deleting user role:", error)
    }
  }

  async findRolesForUser(userId: string) {
    try {
      return await db
        .select({
          roleId: roles.id,
          roleName: roles.name,
        })
        .from(usersRoles)
        .innerJoin(roles, eq(usersRoles.roleId, roles.id))
        .where(eq(usersRoles.userId, userId))
    } catch (error) {
      this.handleError("Error finding roles for user:", error)
    }
  }

  async findUsersForRole(roleId: number) {
    try {
      return await db
        .select({
          userId: users.id,
          userEmail: users.email,
        })
        .from(usersRoles)
        .innerJoin(users, eq(usersRoles.userId, users.id))
        .where(eq(usersRoles.roleId, roleId))
    } catch (error) {
      this.handleError("Error finding users for role:", error)
    }
  }
}
export const userRoleRepository = new UsersRolesRepository();
