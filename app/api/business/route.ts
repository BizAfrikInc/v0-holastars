import { NextRequest, NextResponse } from "next/server";
import { businessRepository } from "@/lib/db/repositories/businesses-repository";
import { ApiError } from "@/lib/errors/api-errors";
import { insertBusinessSchema } from "@/lib/helpers/validation-types"
import { logger } from "@/lib/services/logging/logger";

export async function POST(req: NextRequest) {
  try {
    const data = insertBusinessSchema.parse(await req.json());
    const created = await businessRepository.customCreate(data);

    return NextResponse.json({
      success: true,
      message: "Business created successfully",
      data: created,
    }, { status: 201 });

  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Creating new business",
      method: req.method,
      url: req.url,
      userAgent: req.headers.get("user-agent"),
      error: apiError.message,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({
      success: false,
      message: apiError.message,
      data: apiError.toJson()
    }, { status: apiError.statusCode });
  }
}

export async function GET(req: NextRequest) {
  try {
    const businesses = await businessRepository.findAll();

    return NextResponse.json({
      success: true,
      message: "Fetched all businesses",
      data: businesses
    });
  } catch (error) {
    const apiError = new ApiError(error);

    logger.error({
      message: "Get all businesses",
      method: req.method,
      url: req.url,
      userAgent: req.headers.get("user-agent"),
      error: apiError.message,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({
      success: false,
      message: apiError.message,
      data: apiError.toJson()
    }, { status: apiError.statusCode });
  }
}

