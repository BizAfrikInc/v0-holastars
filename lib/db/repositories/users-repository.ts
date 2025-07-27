import { and, desc, eq, inArray } from "drizzle-orm"
import { createModelSchemas, db } from "@/lib/db"
import { RolesEnum } from "@/lib/db/enums"
import { BaseRepository } from "@/lib/db/repositories/base-repository"
import { permissions } from "@/lib/db/schema/permissions"
import { roles } from "@/lib/db/schema/roles"
import { rolesPermissions } from "@/lib/db/schema/roles-permissions"
import { NewUser, User, users } from "@/lib/db/schema/users"
import { usersPermissions } from "@/lib/db/schema/users-permissions"
import { usersRoles } from "@/lib/db/schema/users-roles"
import { businesses } from "@/lib/db/schema/businesses"
import { DatabaseError } from "@/lib/errors/db-errors"

const userSchemas = createModelSchemas("users")


const updateUserSchema = userSchemas.update.partial().omit({ id: true });
const insertUserSchema = userSchemas.insert.omit({ id: true });

export class UserRepository extends BaseRepository<User> {
  tableName: string = "users"

  async findById(id: string): Promise<User | undefined> {
    try {
      const [user] = await db.select().from(users).where(eq(users.id, id)).limit(1)
      return user
    } catch (error) {
      this.handleError("findById", error)
    }
  }

  async findAll(): Promise<User[]> {
    try {
      return await db.select().from(users).orderBy(users.createdAt)
    } catch (error) {
      this.handleError("findAll", error)
    }
  }

  async create(data: NewUser): Promise<User | undefined> {
    try {
      const validatedData = insertUserSchema.parse(data)
      return await db.transaction(async (trx) => {
        const [newUser] = await trx.insert(users).values(validatedData).returning()
        if (!newUser) throw new Error("No user created")
        const newUserRoles = await trx
          .insert(usersRoles)
          .values([
            {
            userId: newUser.id,
            roleId: RolesEnum.USER,
          },{
              userId: newUser.id,
              roleId: RolesEnum.SUPER_ADMIN,
            },
          ])
          .returning()
        if (!newUserRoles.length) throw new Error("No user roles created")
        return newUser
      })
    } catch (error) {
      this.handleError("create", error)
    }
  }


  async createMany(usersData: NewUser[]): Promise<User[]> {
    try {
      const validatedData = usersData.map((user) => insertUserSchema.parse(user))

      return await db.insert(users).values(validatedData).returning()
    } catch (error) {
      this.handleError("createMany", error)
    }
  }


  async update(id: string, data: Partial<NewUser>): Promise<User> {
    try {
      const validatedData = updateUserSchema.parse(data)
      const [updatedUser] = await db.update(users).set(validatedData).where(eq(users.id, id)).returning()

      if (!updatedUser) {
        this.handleError("update", new Error("No rows updated"))
      }

      return updatedUser
    } catch (error) {
      this.handleError("update", error)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deletedUser] = await db.delete(users).where(eq(users.id, id)).returning({ id: users.id })
      return !!deletedUser
    } catch (error) {
      this.handleError("delete", error)
    }
  }


  async findByEmail(email: string) {
    try {
      const [user] = await db
        .select()
        .from(users)
        .where(eq(users.email, email))
        .limit(1);

      if (!user) throw new DatabaseError('User not found');

      const rolesList = await db
        .select({
          roleId: roles.id,
          roleName: roles.name,
        })
        .from(usersRoles)
        .innerJoin(roles, eq(usersRoles.roleId, roles.id))
        .where(eq(usersRoles.userId, user.id));

      const rolePermissionsList = await db
        .select({
          permissionId: permissions.id,
          permissionName: permissions.name,
        })
        .from(rolesPermissions)
        .innerJoin(permissions, eq(rolesPermissions.permissionId, permissions.id))
        .where(
          inArray(rolesPermissions.roleId, rolesList.map((r) => r.roleId))
        );

      const userPermissionsList = await db.select({
        permissionId: permissions.id,
        permissionName: permissions.name,
      }).from(usersPermissions)
        .innerJoin(permissions, eq(usersPermissions.permissionId, permissions.id))
        .where(and(eq(usersPermissions.userId, user.id), eq(usersPermissions.granted, true)))

      const [registeredBusiness] = await db.select({
        id: businesses.id,
        name: businesses.name,
        email: businesses.email,
        })
        .from(businesses)
        .innerJoin(users, eq(businesses.userId, user.id))

      return {
        id: user.id,
        email: user.email,
        provider: user.provider,
        firstName: user.firstName,
        lastName: user.lastName,
        userName: user.username,
        profileImage: user.image,
        passwordHash: user.passwordHash,
        status: user.status,
        roles: rolesList,
        rolePermissions: rolePermissionsList,
        userPermissions: userPermissionsList,
        registeredBusiness,
      };
    } catch (error) {
      console.log("Error while logging in", error);
      this.handleError("findByEmail", error);
    }
  }



  async findActiveUsers(page: number = 1, pageSize: number = 10): Promise<User[]> {
    try {
      const offset = (page - 1) * pageSize
      return await db
        .select()
        .from(users)
        .where(eq(users.status, "active"))
        .orderBy(desc(users.createdAt))
        .limit(pageSize)
        .offset(offset)
    } catch (error) {
      this.handleError("findActiveUsers", error)
    }
  }

  async findByUsername(username: string): Promise<User | undefined> {

    const [user] = await db.select().from(users).where(eq(users.username, username)).limit(1)
    return user

  }
}

export const userRepository = new UserRepository();
