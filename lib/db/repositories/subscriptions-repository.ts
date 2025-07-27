import { and, eq } from "drizzle-orm";
import { createModelSchemas, db } from "@/lib/db"
import { BaseRepository } from "@/lib/db/repositories/base-repository";
import { NewSubscription, Subscription, subscriptions } from "@/lib/db/schema/subscriptions"

const schema = createModelSchemas("subscriptions");

const insertSchema = schema.insert.omit({ id: true });
const updateSchema = schema.update.partial().omit({ id: true });

export class SubscriptionsRepository extends BaseRepository<Subscription> {
  tableName = "subscriptions";

  async create(data: NewSubscription): Promise<Subscription | undefined> {
    try {
      const validated = insertSchema.parse(data);
      const [created] = await db.insert(subscriptions).values(validated).returning();
      return created;
    } catch (error) {
      this.handleError("create", error);
    }
  }

  async findById(id: string): Promise<Subscription | undefined> {
    try {
      const [sub] = await db.select().from(subscriptions).where(eq(subscriptions.id, id)).limit(1);
      return sub;
    } catch (error) {
      this.handleError("findById", error);
    }
  }

  async findAll(): Promise<Subscription[]> {
    try {
      return await db.select().from(subscriptions);
    } catch (error) {
      this.handleError("findAll", error);
    }
  }

  async findByUserPlanAndCycle(userPlanId: string, billingCycle:   "monthly" | "semi_annually" | "annually"): Promise<Subscription | undefined> {
    try {
      const [sub] = await db.select().from(subscriptions)
        .where(and(eq(subscriptions.userPlanId, userPlanId), eq(subscriptions.billingCycle, billingCycle)))
        .limit(1);
      return sub;
    } catch (error) {
      this.handleError("findByUserPlanAndCycle", error);
    }
  }

  async update(id: string, data: Partial<NewSubscription>): Promise<Subscription> {
    try {
      const validated = updateSchema.parse(data);
      const [updated] = await db.update(subscriptions).set(validated).where(eq(subscriptions.id, id)).returning();
      if (!updated) throw new Error("No subscription updated");
      return updated;
    } catch (error) {
      this.handleError("update", error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db.delete(subscriptions).where(eq(subscriptions.id, id)).returning({ id: subscriptions.id });
      return !!deleted;
    } catch (error) {
      this.handleError("delete", error);
    }
  }
}

export const subscriptionsRepository = new SubscriptionsRepository();
