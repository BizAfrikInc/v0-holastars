import { NextRequest, NextResponse } from "next/server";
import { feedbackRequestsRepository } from "@/lib/db/repositories/feedback-requests-repository";
import { ApiError, HttpException } from "@/lib/errors/api-errors";
import { updateRequestSchema } from "@/lib/helpers/validation-types"
import { logger } from "@/lib/services/logging/logger"


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const record = await feedbackRequestsRepository.findById(id);
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

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = updateRequestSchema.parse(await req.json());
    const updated = await feedbackRequestsRepository.update(id, data);
    return NextResponse.json({ success: true, message: "FeedbackRequest updated", data: updated });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Update FeedbackRequest details",
      method: req.method,
      url: req.url,
      userAgent: req.headers.get("user-agent"),
      error: apiError.message,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await feedbackRequestsRepository.delete(id);
    if (!deleted) throw new HttpException(404, "FeedbackRequest not found");

    return NextResponse.json({ success: true, message: "FeedbackRequest deleted", data: null });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Delete a FeedbackRequest",
      method: req.method,
      url: req.url,
      userAgent: req.headers.get("user-agent"),
      error: apiError.message,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}
