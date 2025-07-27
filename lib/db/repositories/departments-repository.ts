import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { BaseRepository } from "@/lib/db/repositories/base-repository";
import { Department, departments, NewDepartment } from "@/lib/db/schema/departments";
import { insertDepartmentSchema, updateDepartmentSchema } from "@/lib/helpers/validation-types"



export class DepartmentRepository extends BaseRepository<Department> {
  tableName = "departments";

  async create(data: NewDepartment): Promise<Department | undefined> {
    try {
      const validated = insertDepartmentSchema.parse(data);
      const [created] = await db.insert(departments).values(validated).returning();
      return created;
    } catch (error) {
      this.handleError("create", error);
    }
  }

  async findById(id: string): Promise<Department | undefined> {
    try {
      const [record] = await db.select().from(departments).where(eq(departments.id, id)).limit(1);
      return record;
    } catch (error) {
      this.handleError("findById", error);
    }
  }

  async findByLocationId(locationId: string): Promise<Department[]> {
    try {
      return await db.select().from(departments).where(eq(departments.locationId, locationId));
    } catch (error) {
      this.handleError("findByLocationId", error);
    }
  }

  async update(id: string, data: Partial<NewDepartment>): Promise<Department> {
    try {
      const validated = updateDepartmentSchema.parse(data);
      const [updated] = await db.update(departments).set(validated).where(eq(departments.id, id)).returning();
      if (!updated) throw new Error("Department not found");
      return updated;
    } catch (error) {
      this.handleError("update", error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db.delete(departments).where(eq(departments.id, id)).returning({ id: departments.id });
      return !!deleted;
    } catch (error) {
      this.handleError("delete", error);
    }
  }

  async findAll(): Promise<Department[]> {
    try {
      return await db.select().from(departments);
    } catch (error) {
      this.handleError("findAll", error);
    }
  }
}

export const departmentRepository = new DepartmentRepository();
