import { NextRequest, NextResponse } from "next/server";
import { feedbackRequestsRepository } from "@/lib/db/repositories/feedback-requests-repository";
import { ApiError, HttpException } from "@/lib/errors/api-errors";
import { logger } from "@/lib/services/logging/logger"


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const record = await feedbackRequestsRepository.feedbackRequestDetails(id);
    if (!record) throw new HttpException(404, "Feedback request not found");

    return NextResponse.json({ success: true, message: "Feedback request found", data: record });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Find FeedbackRequest details",
      method: req.method,
      url: req.url,
      userAgent: req.headers.get("user-agent"),
      error: apiError.message,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}