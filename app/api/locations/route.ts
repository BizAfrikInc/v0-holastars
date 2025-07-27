import { NextRequest, NextResponse } from "next/server";
import { locationRepository } from "@/lib/db/repositories/locations-repository";
import { ApiError } from "@/lib/errors/api-errors";
import { insertLocationSchema } from "@/lib/helpers/validation-types"
import { logger } from "@/lib/services/logging/logger";


export async function POST(req: NextRequest) {
  try {
    const data = insertLocationSchema.parse(await req.json());
    const location = await locationRepository.create(data);

    return NextResponse.json({
      success: true,
      message: "Location created",
      data: location,
    }, { status: 201 });

  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Location creation failed",
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

export async function GET(req:  NextRequest) {
  try {
    const locations = await locationRepository.findAll();
    return NextResponse.json({
      success: true,
      message: "Fetched all locations",
      data: locations,
    });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Get all locations",
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
