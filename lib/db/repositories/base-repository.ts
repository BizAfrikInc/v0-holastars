import { sql } from "drizzle-orm"
import { z } from "zod"
import {db } from "@/lib/db"
import { DatabaseError } from "@/lib/errors/db-errors"
import {logger }  from '@/lib/services/logging/logger'

export  abstract class BaseRepository<T> {

  abstract tableName: string
  abstract findById(id: string): Promise<T | undefined>
  abstract findAll(): Promise<T[]>
  abstract create(entity: T): Promise<T | undefined>
  abstract update(id: string, entity: Partial<T>): Promise<T>
  abstract delete(id: string): Promise<boolean>


  async executeRawQuery<R>(
    query: string,
    resultSchema: z.ZodType<R>
  ): Promise<R[]> {
    try {
      const result = await db.execute(sql.raw(query));
      return result.rows.map(row => resultSchema.parse(row));
    } catch (error) {
      this.handleError('executeRawQuery', error);
    }
  }
  

  protected handleError(operation: string, error: unknown): never {
    logger.error({
      message: `Error in  ${this.tableName}: (${operation})`,
      error: error instanceof Error ? error.message : "Unknown error",
      operation,
    })

    if (error instanceof z.ZodError) {
      throw new DatabaseError("Validation error",)
    }

    if (error instanceof Error) {
      throw new DatabaseError(`Database operation failed: ${error.message}`)
    }

    throw new DatabaseError("Unknown database error")
  }
}