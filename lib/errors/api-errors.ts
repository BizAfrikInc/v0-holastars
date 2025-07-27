import { ZodError } from "zod"
import { DatabaseError } from "@/lib/errors/db-errors"


export class HttpException extends Error {
  constructor(public statusCode: number, message: string, public details?: Record<string, unknown>) {
    super(message);
    this.name = "HttpException";
  }
}

export class ApiError extends Error {
  statusCode: number
  details?: Record<string, unknown>

  constructor(error: unknown) {
    super()

    switch (true) {
      case error instanceof ZodError:
        this.message = "Validation failed"
        this.statusCode = 422
        this.details = {
          issues: error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
          })),
        }
        break

      case error instanceof HttpException:
        this.message = error.message
        this.statusCode = error.statusCode
        if (error.details) this.details = error.details;
        break

      case error instanceof SyntaxError:
        this.message = "Invalid JSON syntax"
        this.statusCode = 400
        break

      case error instanceof TypeError:
        this.message = "Invalid input type or undefined variable"
        this.statusCode = 400
        break

      case error instanceof RangeError:
        this.message = "Input value out of range"
        this.statusCode = 400
        break

      case error instanceof DatabaseError && error.name === "DatabaseError":
        this.message = (error as Error).message || "Database error"
        this.statusCode = 500
        this.details = { databaseError: (error as Error).message }
        break

      case error instanceof Error:
        this.message = (error as Error).message
        this.statusCode = 400
        break

      case typeof error === "string":
        this.message = error as string
        this.statusCode = 400
        break

      default:
        this.message = "An unknown error occurred"
        this.statusCode = 500
        break
    }

    if (error instanceof Error && error.stack) {
      this.stack = error.stack
    }
  }

  toJson() {
    return {
      error: this.message,
      ...(this.details ? { details: this.details } : {}),
    }
  }
}
