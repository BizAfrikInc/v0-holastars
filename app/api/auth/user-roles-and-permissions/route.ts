import { NextRequest, NextResponse } from "next/server"
import { userRepository } from "@/lib/db/repositories/users-repository"
import { ApiError, HttpException } from "@/lib/errors/api-errors"
import {
  fetchUserRolesPermissionRequestSchema,
  JsonResponse,
  UserRolesPermissionsResponse,
} from "@/lib/helpers/validation-types"
import { logger } from "@/lib/services/logging/logger"


export async function  POST (req: NextRequest) {

  try {
    const { email } = fetchUserRolesPermissionRequestSchema.parse(await req.json())
    const user = await userRepository.findByEmail(email)
    if (!user) {
        throw new HttpException(404, "User with provided email or password not found")
    }
    const responseData: UserRolesPermissionsResponse = {
      success: true,
      message: "User Roles and Permissions fetched successfully",
      data: { ...user, username: user.userName },
    }
    return NextResponse.json(responseData)
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Fetching User Roles and Permissions error",
      method: req.method,
      url: req.url,
      userAgent: req.headers.get("user-agent"),
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
      { status: apiError.statusCode }
    );

  }
}