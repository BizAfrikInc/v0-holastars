import { format } from "date-fns"
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config"
import { userRepository } from "@/lib/db/repositories/users-repository";
import { ApiError } from "@/lib/errors/api-errors";
import { forgotPasswordRequestSchema, JsonResponse } from "@/lib/helpers/validation-types"
import { emailService } from "@/lib/services/emails/zeptomail"
import { ValidatedTemplateEmailOptions } from "@/lib/services/emails/zeptomail/types"
import { logger } from "@/lib/services/logging/logger";
import { generateVerificationToken } from "@/lib/services/Tokens/verification-tokens"

export async function POST(req: NextRequest) {
  try {
    const { email } = forgotPasswordRequestSchema.parse(await req.json());

    const user = await userRepository.findByEmail(email);

    if (!user) {
      logger.warn({
        message: "Forgot password attempted for non-existent user",
        email,
        timestamp: new Date().toISOString(),
      });

      const response: JsonResponse = {
        success: false,
        message: "If an account with that email exists, a reset link has been sent. ",
        data: {
          email: email,
        },
      }

      return NextResponse.json(
        response,
        { status: 200 }
      );
    }

    const { token, expiresAt } = await generateVerificationToken(user.id)

    const resetLink = `${config.public.siteUrl}/auth/reset-password?token=${token}`;

    logger.info({
      message: "Password reset email would be sent",
      to: email,
      resetLink,
    });

    const emailPayload: ValidatedTemplateEmailOptions = {
      to: [
        {
          email_address: {
            address:user.email,
            name: `${user.firstName} ${user.lastName}`,
          }
        }],
      from: {
        address: config.public.systemEmail,
        name: "Hola Stars"
      },
      mail_template_key: config.public.resetPasswordTemplateKey,
      merge_info: {
        first_name: user.firstName,
        reset_link: resetLink,
        expiry_time: format(expiresAt, 'EEE, MMM dd yyyy hh:mm:ss a'),
        user_name: user.userName
      }

    }

    await emailService.sendTemplateEmail(emailPayload)

    const responseData: JsonResponse = {
      success: true,
      message: "If an account with that email exists, a reset link has been sent.",
      data: {
        email: email,
        resetLink: resetLink,
      },
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Forgot password error",
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
