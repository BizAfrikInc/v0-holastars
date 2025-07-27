import { NextRequest, NextResponse } from "next/server";
import { feedbackRequestsRepository } from "@/lib/db/repositories/feedback-requests-repository";
import { ApiError } from "@/lib/errors/api-errors";
import { insertRequestSchema } from "@/lib/helpers/validation-types"
import { logger } from "@/lib/services/logging/logger";

export async function POST(req: NextRequest) {
  try {
    const data = insertRequestSchema.parse(await req.json());
    const result = await feedbackRequestsRepository.augmentedCreate(data);
    return NextResponse.json({ success: true, message: "Request queued", data: result }, { status: 201 });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}


export async function GET(req: NextRequest) {
  try {
      const all = await feedbackRequestsRepository.findAll();
        return NextResponse.json({
          success: true,
          message: "Fetched all feedback requests",
          data: all,
        });
  } catch (e) {
    const apiError = new ApiError(e);
    logger.error({
      message: "Fetching all feedback  requests",
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

