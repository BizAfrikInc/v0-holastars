import { eq, lt } from "drizzle-orm";
import { createModelSchemas, db } from "@/lib/db";
import { BaseRepository } from "@/lib/db/repositories/base-repository";
import { NewVerificationToken, VerificationToken, verificationTokens } from "@/lib/db/schema/verification-tokens";

const tokenSchemas = createModelSchemas("verificationTokens");

const insertTokenSchema = tokenSchemas.insert.omit({ id: true });
const updateTokenSchema = tokenSchemas.update.partial().omit({ id: true });


export class VerificationTokensRepository extends BaseRepository<VerificationToken> {
  tableName = "passwordResetTokens";

  async findById(id: string): Promise<VerificationToken | undefined> {
    try {
      const [token] = await db
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.id, id))
        .limit(1);
      return token;
    } catch (error) {
      this.handleError("findById", error);
    }
  }

  async findAll(): Promise<VerificationToken[]> {
    try {
      return await db.select().from(verificationTokens);
    } catch (error) {
      this.handleError("findAll", error);
    }
  }

  async create(data: Partial<NewVerificationToken>): Promise<VerificationToken | undefined> {
    try {
      const validated = insertTokenSchema.parse(data);
      const [token] = await db.insert(verificationTokens).values(validated).returning();
      return token;
    } catch (error) {
      this.handleError("create", error);
    }
  }

  async createMany(data: Partial<NewVerificationToken>[]): Promise<VerificationToken[]> {
    try {
      const validated = data.map((d) => insertTokenSchema.parse(d));
      return await db.insert(verificationTokens).values(validated).returning();
    } catch (error) {
      this.handleError("createMany", error);
    }
  }

  async update(id: string, data: Partial<NewVerificationToken>): Promise<VerificationToken> {
    try {
      const validated = updateTokenSchema.parse(data);
      const [updated] = await db
        .update(verificationTokens)
        .set(validated)
        .where(eq(verificationTokens.id, id))
        .returning();

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
      const [deleted] = await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.id, id))
        .returning({ id: verificationTokens.id });
      return !!deleted;
    } catch (error) {
      this.handleError("delete", error);
    }
  }

  async findByToken(token: string): Promise<VerificationToken | null> {
    try {
      const [result] = await db
        .select()
        .from(verificationTokens)
        .where(eq(verificationTokens.token, token))
        .limit(1);
      return result ?? null;
    } catch (error) {
      this.handleError("findByToken", error);
    }
  }

  async deleteExpired(currentDate: Date = new Date()): Promise<number> {
    try {
      const deleted = await db
        .delete(verificationTokens)
        .where(lt(verificationTokens.expiresAt, currentDate))
        .returning({ id: verificationTokens.id });
      return deleted.length;
    } catch (error) {
      this.handleError("deleteExpired", error);
    }
  }

  async deleteByUserId(userId: string): Promise<boolean> {
    try {
      const [deleted] = await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.userId, userId))
        .returning({ id: verificationTokens.id });
      return !!deleted;
    } catch (error) {
      this.handleError("deleteByUserId", error);
    }
  }
  async deleteByToken(token: string): Promise<boolean> {
    try {
      const [deleted] = await db
        .delete(verificationTokens)
        .where(eq(verificationTokens.token, token))
        .returning({ id: verificationTokens.id });
      return !!deleted;
    } catch (error) {
      this.handleError("deleteByToken", error);
    }
  }
}

export const verificationTokensRepository = new VerificationTokensRepository();
