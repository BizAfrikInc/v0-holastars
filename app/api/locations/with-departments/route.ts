import { NextRequest, NextResponse } from "next/server";
import { locationRepository } from "@/lib/db/repositories/locations-repository";
import { ApiError } from "@/lib/errors/api-errors";
import { logger } from "@/lib/services/logging/logger";

export async function GET(req:  NextRequest) {
  try {
    const locations = await locationRepository.findAllWithDepartments();
    return NextResponse.json({
      success: true,
      message: "Fetched all locations with departments",
      data: locations,
    });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Get all locations  with departments",
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