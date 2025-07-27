import {  eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { BaseRepository } from "@/lib/db/repositories/base-repository";
import { Location, locations, LocationWithDepartments, NewLocation } from "@/lib/db/schema/locations";
import { insertLocationSchema, updateLocationSchema } from "@/lib/helpers/validation-types"
import { departments } from "../schema/departments";



export class LocationRepository extends BaseRepository<Location> {
  tableName = "locations";

  async create(data: NewLocation): Promise<Location | undefined> {
    try {
      const validated = insertLocationSchema.parse(data);
      const [created] = await db.insert(locations).values(validated).returning();
      return created;
    } catch (error) {
      this.handleError("create", error);
    }
  }

  async findById(id: string): Promise<Location | undefined> {
    try {
      const [loc] = await db.select().from(locations).where(eq(locations.id, id)).limit(1);
      return loc;
    } catch (error) {
      this.handleError("findById", error);
    }
  }

  async findByBusinessId(businessId: string): Promise<Location[]> {
    try {
      return await db.select().from(locations).where(eq(locations.businessId, businessId));
    } catch (error) {
      this.handleError("findByBusinessId", error);
    }
  }

  async update(id: string, data: Partial<NewLocation>): Promise<Location> {
    try {
      const validated = updateLocationSchema.parse(data);
      const [updated] = await db.update(locations).set(validated).where(eq(locations.id, id)).returning();
      if (!updated) throw new Error("Location not found");
      return updated;
    } catch (error) {
      this.handleError("update", error);
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      const [deleted] = await db.delete(locations).where(eq(locations.id, id)).returning({ id: locations.id });
      return !!deleted;
    } catch (error) {
      this.handleError("delete", error);
    }
  }

  async findAll(): Promise<Location[]> {
    try {
      return await db.select().from(locations);
    } catch (error) {
      this.handleError("findAll", error);
    }
  }
  async findAllWithDepartments(): Promise<LocationWithDepartments[]> {
    try {
      const lcn = await db.select().from(locations);
      if(!lcn || lcn.length === 0) return [];
      const lcnWithDepartments =  lcn.map(async (location)=>{
        const dpts = await db.select().from(departments).where(eq(departments.locationId, location.id)); 
        if(!dpts || dpts.length === 0) return { location, departments: [] };
        return {
          location,
          departments: dpts
        }
      })
      return await Promise.all(lcnWithDepartments);
      
    } catch (error) {
      this.handleError("findAllWithDepartments", error);
    }
  }
}

export const locationRepository = new LocationRepository();
