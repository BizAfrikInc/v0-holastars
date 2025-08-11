import { and, eq } from "drizzle-orm"
import { createModelSchemas, db } from "@/lib/db"
import { BaseRepository } from "@/lib/db/repositories/base-repository"
import {
  type NewSocialMediaConnection,
  type SocialMediaConnection,
  socialMediaConnections,
} from "@/lib/db/schema/social-media-connections"

const connectionSchemas = createModelSchemas("socialMediaConnections")
const updateConnectionSchema = connectionSchemas.update.partial().omit({ id: true })
const insertConnectionSchema = connectionSchemas.insert.omit({ id: true })

export class SocialMediaConnectionsRepository extends BaseRepository<SocialMediaConnection> {
  tableName = "social_media_connections"

  async findById(id: string): Promise<SocialMediaConnection | undefined> {
    try {
      const [connection] = await db
        .select()
        .from(socialMediaConnections)
        .where(eq(socialMediaConnections.id, id))
        .limit(1)
      return connection
    } catch (error) {
      this.handleError("findById", error)
    }
  }

  async findByBusinessId(businessId: string): Promise<SocialMediaConnection[]> {
    try {
      return await db
        .select()
        .from(socialMediaConnections)
        .where(eq(socialMediaConnections.businessId, businessId))
        .orderBy(socialMediaConnections.createdAt)
    } catch (error) {
      this.handleError("findByBusinessId", error)
    }
  }

  async findByBusinessAndPlatform(businessId: string, platform: string): Promise<SocialMediaConnection | undefined> {
    try {
      const [connection] = await db
        .select()
        .from(socialMediaConnections)
        .where(
          and(eq(socialMediaConnections.businessId, businessId), eq(socialMediaConnections.platform, platform as any)),
        )
        .limit(1)
      return connection
    } catch (error) {
      this.handleError("findByBusinessAndPlatform", error)
    }
  }

  async create(data: NewSocialMediaConnection): Promise<SocialMediaConnection | undefined> {
    try {
      const validatedData = insertConnectionSchema.parse(data)
      const [newConnection] = await db.insert(socialMediaConnections).values(validatedData).returning()
      return newConnection
    } catch (error) {
      this.handleError("create", error)
    }
  }

  async update(id: string, data: Partial<NewSocialMediaConnection>): Promise<SocialMediaConnection> {
    try {
      const validatedData = updateConnectionSchema.parse(data)
      const [updatedConnection] = await db
        .update(socialMediaConnections)
        .set({ ...validatedData, updatedAt: new Date() })
        .where(eq(socialMediaConnections.id, id))
        .returning()

      if (!updatedConnection) {
        this.handleError("update", new Error("No rows updated"))
      }

      return updatedConnection
    } catch (error) {
      this.handleError("update", error)
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deletedConnection] = await db
        .delete(socialMediaConnections)
        .where(eq(socialMediaConnections.id, id))
        .returning({ id: socialMediaConnections.id })
      return !!deletedConnection
    } catch (error) {
      this.handleError("delete", error)
    }
  }

  async findActiveConnections(businessId: string): Promise<SocialMediaConnection[]> {
    try {
      return await db
        .select()
        .from(socialMediaConnections)
        .where(
          and(
            eq(socialMediaConnections.businessId, businessId),
            eq(socialMediaConnections.isActive, true),
            eq(socialMediaConnections.autoPostEnabled, true),
          ),
        )
    } catch (error) {
      this.handleError("findActiveConnections", error)
    }
  }
    findAll(): Promise<{ id: string; createdAt: Date; updatedAt: Date | null; businessId: string; isActive: boolean | null; platform: "google_business" | "facebook" | "yelp"; platformAccountId: string; platformAccountName: string; accessToken: string; refreshToken: string | null; tokenExpiresAt: Date | null; autoPostEnabled: boolean | null; minRatingThreshold: string | null }[]> {
    throw new Error("Method not implemented.")
  }
}

export const socialMediaConnectionsRepository = new SocialMediaConnectionsRepository()
