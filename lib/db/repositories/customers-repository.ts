import { desc, eq, sql } from "drizzle-orm"
import { createModelSchemas, db } from "@/lib/db"
import { BaseRepository } from "@/lib/db/repositories/base-repository";
import { type Customer, customers, type NewCustomer } from "@/lib/db/schema/customers"
const schemas = createModelSchemas("customers");
const insertSchema = schemas.insert.omit({ id: true });
const updateSchema = schemas.update.partial().omit({ id: true });

export class CustomersRepository extends BaseRepository<Customer> {
  tableName = "hs_customers";

  async create(data: NewCustomer) {
   try{
     const validated = insertSchema.parse(data);
     const [created] = await db.insert(customers).values(validated).returning();
     return created;
   } catch (e) {
     this.handleError('create', e)

   }
  }

  async createMany(data: NewCustomer[]) {
    try {
      const validated = data.map((d) => insertSchema.parse(d));

      return await db
        .insert(customers)
        .values(validated)
        .onConflictDoUpdate({
          target: [customers.email, customers.businessId],
          set: {
            customerName: sql.raw(`excluded."CustomerName"`),
            email: sql.raw(`excluded."Email"`),
            phoneNumber: sql.raw(`excluded."PhoneNumber"`),
            updatedAt: sql.raw(`now()`),
          }
        })
        .returning();
    } catch (e) {
      this.handleError("createMany", e);
    }
  }

  async findById(id: string) {
   try {
     const [cust] = await db.select().from(customers).where(eq(customers.id, id)).limit(1);
     return cust;
   }catch (e) {
     this.handleError('findById', e)

   }
  }

  async findAll() {
    try {
      return await db.select().from(customers).orderBy(desc(customers.createdAt));
    }catch (e) {
      this.handleError('findAll', e);
    }
  }

  async findByBusinessId(businessId: string) {
    try {
      return await db.select().from(customers).where(eq(customers.businessId, businessId));
    }catch (e) {
      this.handleError('findByBusinessId', e);
    }
  }

  async update(id: string, data: Partial<NewCustomer>) {
    try {
      const validated = updateSchema.parse(data);
      const [updated] = await db.update(customers).set(validated).where(eq(customers.id, id)).returning();
      if (!updated) throw new Error("Customer not found");
      return updated;
    }catch(e){
      this.handleError('update', e);
    }
  }

  async delete(id: string) {
    try{
      const [deleted] = await db.delete(customers).where(eq(customers.id, id)).returning({ id: customers.id });
      return !!deleted;

    } catch(e){
      this.handleError('delete', e);
    }
  }
}

export const customersRepository = new CustomersRepository();
