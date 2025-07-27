import { desc, eq } from "drizzle-orm"
import { createModelSchemas, db } from "@/lib/db"
import { RolesEnum } from "@/lib/db/enums"
import { BaseRepository } from "@/lib/db/repositories/base-repository"
import { type Business, businesses, type NewBusiness } from "@/lib/db/schema/businesses"
import { permissions } from "@/lib/db/schema/permissions"
import { roles } from "@/lib/db/schema/roles"
import { rolesPermissions } from "@/lib/db/schema/roles-permissions"
import { usersRoles } from "@/lib/db/schema/users-roles"

const businessSchemas = createModelSchemas("businesses")

const updateBusinessSchema = businessSchemas.update.partial().omit({ id: true })
const insertBusinessSchema = businessSchemas.insert.omit({ id: true })
interface Permission {
  permissionId: number
  permissionName: string
}
interface Role {
  roleId: number
  roleName: string
}
interface CreatedBusiness {
  business: Business
  role: Role
  permissions: Permission[]
}

export class BusinessRepository extends BaseRepository<Business> {
  tableName = "businesses"

  async findById(id: string): Promise<Business | undefined> {
    try {
      const [business] = await db.select().from(businesses).where(eq(businesses.id, id)).limit(1)
      return business
    } catch (error) {
      this.handleError("findById", error)
    }
  }

  async findAll(): Promise<Business[]> {
    try {
      return await db.select().from(businesses).orderBy(businesses.createdAt)
    } catch (error) {
      this.handleError("findAll", error)
    }
  }
  async create(data: NewBusiness): Promise<Business | undefined> {
    try {
      const validatedData = insertBusinessSchema.parse(data)
      const [newBusiness] = await db.insert(businesses).values(validatedData).returning()
      return newBusiness
    } catch (error) {
      this.handleError("create", error)
    }
  }

  async customCreate(data: NewBusiness): Promise<CreatedBusiness | undefined> {
    try {
      const validatedData = insertBusinessSchema.parse(data)
      return  await db.transaction(async  (trx)=>{
        const [newBusiness] = await trx.insert(businesses).values(validatedData).returning()
        if (!newBusiness) throw new Error("No business created")
        const [newUserRole] = await trx
          .insert(usersRoles)
          .values(
            {
              userId: validatedData.userId,
              roleId: RolesEnum.BUSINESS_ADMIN,
            }
          )
          .returning()
        if (!newUserRole) throw new Error("No user role created")

        const [role] = await db.select().from(roles).where(eq(roles.id, newUserRole.roleId ))
        if (!role) throw new Error("No role found for that user role Id")
        const rolePermissionsList = await db
          .select({
            permissionId: permissions.id,
            permissionName: permissions.name,
          })
          .from(rolesPermissions)
          .innerJoin(permissions, eq(rolesPermissions.permissionId, permissions.id))
          .where(eq(rolesPermissions.roleId, role.id));
        return { business: newBusiness, role: { roleId: role.id, roleName: role.name }, permissions: rolePermissionsList }
      })
    } catch (error) {
      this.handleError("custom creating a business with roles and permissions attached", error)
    }
  }

  async update(id: string, data: Partial<NewBusiness>): Promise<Business> {
    try {
      const validatedData = updateBusinessSchema.parse(data)
      const [updatedBusiness] = await db.update(businesses).set(validatedData).where(eq(businesses.id, id)).returning()
      if (!updatedBusiness) throw new Error("No rows updated")
      return updatedBusiness
    } catch (error) {
      this.handleError("update", error)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db.delete(businesses).where(eq(businesses.id, id)).returning({ id: businesses.id })
      return !!deleted
    } catch (error) {
      this.handleError("delete", error)
    }
  }

  async findByEmail(email: string): Promise<Business | undefined> {
    try {
      const [business] = await db.select().from(businesses).where(eq(businesses.email, email)).limit(1)
      return business
    } catch (error) {
      this.handleError("findByEmail", error)
    }
  }

  async findByUserId(userId: string): Promise<Business[]> {
    try {
      return await db.select().from(businesses).where(eq(businesses.userId, userId)).orderBy(desc(businesses.createdAt))
    } catch (error) {
      this.handleError("findByUserId", error)
    }
  }
}

export const businessRepository = new BusinessRepository()
