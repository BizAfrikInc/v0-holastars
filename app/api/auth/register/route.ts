import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { config } from "@/lib/config"
import { StatusEnum } from "@/lib/db/enums"
import { userRepository } from "@/lib/db/repositories/users-repository";
import { ApiError, HttpException } from "@/lib/errors/api-errors"
import { generateUsername } from "@/lib/helpers/generate-username"
import { JsonResponse, registerRequestSchema } from "@/lib/helpers/validation-types"
import { emailService } from "@/lib/services/emails/zeptomail"
import {  ValidatedTemplateEmailOptions } from "@/lib/services/emails/zeptomail/types"
import { logger } from "@/lib/services/logging/logger"
import { generateVerificationToken } from "@/lib/services/Tokens/verification-tokens"




export async function POST(req: NextRequest) {
  try {
    const { email, password, firstName, lastName } = registerRequestSchema.parse(await req.json());

    const existing = await userRepository.findByEmail(email);
    if (existing) throw new HttpException(400, "Email already exists");

    const username = await generateUsername(firstName, lastName);
    const passwordHash = await bcrypt.hash(password, 10);

    const newUser = await userRepository.create({
      email,
      passwordHash,
      provider: "custom_credentials",
      username,
      firstName,
      lastName,
      status: StatusEnum.PENDING,
    });

    if(!newUser) throw new HttpException(500, "Failed to create user")

    const { token } = await generateVerificationToken(newUser.id, 43200)

    const link = `${config.public.siteUrl}/auth/verify-email?token=${token}`;

    const emailPayload: ValidatedTemplateEmailOptions = {
      to: [
        {
          email_address: {
            address:newUser.email,
            name: `${newUser.firstName} ${newUser.lastName}`,
          }
        }],
      from: {
          address: config.public.systemEmail,
            name: "Hola Stars"
        },
        mail_template_key: config.public.registrationTemplateKey,
        merge_info: {
        firstName: newUser.firstName,
        verify_account_link: link,
        email: newUser.email,
        username: newUser.username,
        }

    }

    await emailService.sendTemplateEmail(emailPayload)

    const response: JsonResponse = {
      success: true,
      message: "Registration successful. Please check your email to verify your account.",
      data: {
        email: newUser.email,
        username: newUser.username,
      }
    }

    return NextResponse.json(response, { status: 201 });
  } catch (error) {

    const apiError = new ApiError(error);
    logger.error({
      message: apiError.message,
      method: req.method,
      url: req.url,
      userAgent: req.headers.get("user-agent"),
      error: apiError.message,
      timestamp: new Date().toISOString(),
    });
    const response: JsonResponse = {
      success: false,
      message: "Registration failed",
      data: apiError.toJson(),
    }
    return NextResponse.json(response, { status: apiError.statusCode });
  }
}
