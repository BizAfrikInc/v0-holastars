import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { userRepository } from "@/lib/db/repositories/users-repository";
import { ApiError, HttpException } from "@/lib/errors/api-errors";
import { JsonResponse, resetPasswordRequestSchema } from "@/lib/helpers/validation-types";
import { logger } from "@/lib/services/logging/logger";
import { invalidateVerificationToken, verifyVerificationToken } from "@/lib/services/Tokens/verification-tokens"

export async function POST(req: NextRequest) {
  try {
    const { token, newPassword } = resetPasswordRequestSchema.parse(await req.json());
    if(!token) throw new HttpException(404, "Token is required");


    const userId = await verifyVerificationToken(token);

    if (!userId) {
      throw new HttpException(400, "Invalid or expired reset token.");
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await userRepository.update(userId, { passwordHash: hashedPassword });

    await invalidateVerificationToken(token);

    const responseData: JsonResponse = {
      success: true,
      message: "Password has been reset successfully.",
    };

    return NextResponse.json(responseData, { status: 200 });

  } catch (error) {
    const apiError = new ApiError(error);

    logger.error({
      message: "Password reset error",
      error: apiError.message,
      timestamp: new Date().toISOString(),
    });

    const responseData: JsonResponse = {
      success: false,
      message: apiError.message,
      data: apiError.toJson(),
    };

    return NextResponse.json(responseData, { status: apiError.statusCode });
  }
}
