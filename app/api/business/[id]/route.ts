import { NextRequest, NextResponse } from "next/server";
import { businessRepository } from "@/lib/db/repositories/businesses-repository";
import { ApiError, HttpException } from "@/lib/errors/api-errors";
import { updateBusinessSchema } from "@/lib/helpers/validation-types"
import { logger } from "@/lib/services/logging/logger"


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const business = await businessRepository.findById(id);
    if (!business) throw new HttpException(404, "Business not found");

    return NextResponse.json({
      success: true,
      message: "Business found",
      data: business
    });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Find business details",
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



export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = updateBusinessSchema.parse(await req.json());
    const updated = await businessRepository.update(id, payload);

    return NextResponse.json({
      success: true,
      message: "Business updated",
      data: updated,
    });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Update business details",
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

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await businessRepository.delete(id);
    if (!deleted) throw new HttpException(404, "Business not found");

    return NextResponse.json({
      success: true,
      message: "Business deleted",
      data: null
    });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Delete business details",
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

