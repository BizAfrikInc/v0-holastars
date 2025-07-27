import { NextRequest, NextResponse } from "next/server";
import { StatusEnum } from "@/lib/db/enums"
import { userRepository } from "@/lib/db/repositories/users-repository";
import { ApiError, HttpException } from "@/lib/errors/api-errors"
import { JsonResponse, verifyEmailSchema } from "@/lib/helpers/validation-types"
import { signJwt } from "@/lib/services/jwt"
import { invalidateVerificationToken, verifyVerificationToken } from "@/lib/services/Tokens/verification-tokens"

export async function GET(req: NextRequest) {
  try {
    const queryParam = req.nextUrl.searchParams.get('token');

    const emailVToken = verifyEmailSchema.parse(queryParam);

    const userId = await verifyVerificationToken(emailVToken);

    if(!userId) throw  new HttpException(400, "Invalid or expired token");
    await invalidateVerificationToken(emailVToken);

    const user = await userRepository.update(userId, { status : StatusEnum.ACTIVE });
    const authToken = await signJwt({ userId: user.id, email: user.email });


    const responseData: JsonResponse = {
      success: true,
      message: "Email verified. You can now log in.",
    }

    const response = NextResponse.json(responseData, { status: 200 });
    response.cookies.set("auth_token", authToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return response;
  } catch (error) {
    const apiError = new ApiError(error);
    const response: JsonResponse = {
      success: false,
      message: apiError.message,
      data: apiError.toJson(),
    }
    return NextResponse.json(response, { status: apiError.statusCode });
  }
}
