import bcrypt from 'bcryptjs';
import { NextRequest, NextResponse } from 'next/server';
import { StatusEnum } from "@/lib/db/enums"
import { userRepository } from "@/lib/db/repositories/users-repository"
import { ApiError, HttpException } from "@/lib/errors/api-errors"
import { AuthResponse, JsonResponse, loginRequestSchema } from "@/lib/helpers/validation-types"
import { signJwt } from '@/lib/services/jwt';
import { logger } from "@/lib/services/logging/logger"

export async function POST(req: NextRequest) {
  try {
    const { email, password } = loginRequestSchema.parse(await req.json());

    const user = await userRepository.findByEmail(email);


    if (!user || user.passwordHash && !(await bcrypt.compare(password, user.passwordHash))) {
      throw new HttpException(401, "Invalid email or password")
    }

    if (user.status !== StatusEnum.ACTIVE) {
      throw new HttpException(401, "Account is not active, kindly check your email to verify your account.")
    }
    const token = await signJwt({ userId: user.id, email: user.email });
    const responseData:AuthResponse = {
      success: true,
      message: "Login successful",
      data: {
        email: user.email,
      },
    }

    const response = NextResponse.json(responseData, { status: 200 });
    response.cookies.set("auth_token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Login error",
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
