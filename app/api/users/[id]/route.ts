import { NextRequest, NextResponse } from "next/server"
import { userRepository } from "@/lib/db/repositories/users-repository"
import { ApiError } from "@/lib/errors/api-errors"
import { updateUserSchema } from "@/lib/helpers/validation-types"
import { logger } from "@/lib/services/logging/logger"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const payload = updateUserSchema.parse(await req.json());
    const updated = await userRepository.update(id, payload);

    return NextResponse.json({
      success: true,
      message: "User updated",
      data: updated,
    });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Update user details",
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