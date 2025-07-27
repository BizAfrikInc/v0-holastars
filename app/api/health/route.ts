import { sql } from "drizzle-orm";
import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ApiError } from "@/lib/errors/api-errors"
import { JsonResponse } from "@/lib/helpers/validation-types"
import { logger } from "@/lib/services/logging/logger";

export async function GET(request: NextRequest) {
  try {
    const dbCheckResults: Record<string, unknown> = {};

    await db.execute(sql`SELECT 1`);
    dbCheckResults.ping = true;
    const tables = await db.execute(sql`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' AND table_type = 'BASE TABLE'
    `);
    dbCheckResults.tables = tables.rows.map(row => row.table_name);

    try {
      const userCount = await db.execute(sql`SELECT COUNT(*) FROM hs_users`);
      dbCheckResults.hs_users_count = Number(userCount.rows[0]?.count ?? 0);
    } catch {
      dbCheckResults.hs_users_count = 'unknown';
    }

    logger.info({
      message: "Health check hit",
      method: request.method,
      url: request.url,
      dbStatus: dbCheckResults,
      userAgent: request.headers.get("user-agent"),
      timestamp: new Date().toISOString(),
    });

    const responseData: JsonResponse = {
      success: true,
      message: "OK",
      data: {
        db: dbCheckResults
      },
    }

    return NextResponse.json(
      responseData,
      { status: 200 }
    );
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Health check error",
      error: apiError.message,
      timestamp: new Date().toISOString(),
    });

    const responseData: JsonResponse = {
      success: false,
      message: apiError.message,
      data: apiError.toJson(),
    }

    return NextResponse.json(
      responseData,
      { status: 500 }
    );
  }
}
