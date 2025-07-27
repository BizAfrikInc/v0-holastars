import { NextRequest, NextResponse } from 'next/server';
import { ApiError } from "@/lib/errors/api-errors"
import { JsonResponse } from "@/lib/helpers/validation-types"
import { emailService } from "@/lib/services/emails/zeptomail"
import {
  EmailRequestSchema
} from "@/lib/services/emails/zeptomail/types"
import { logger } from "@/lib/services/logging/logger"

export async function POST(req: NextRequest) {
  try {
    const data = EmailRequestSchema.parse(await req.json());

    let response;

    switch (data.type) {
      case 'single':
        response = await emailService.sendSingleEmail(data);
        break;

      case 'batch':
        response = await emailService.sendBatchEmails(data);
        break;

      case 'template':
        response = await emailService.sendTemplateEmail(data);
        break;

      case 'batch-template':
        response = await emailService.sendBatchTemplateEmail(data);
        break;

      default:
        const responseData: JsonResponse = {
          success: false,
          message: 'Unsupported template type',
        }
        return NextResponse.json(
          responseData,
          { status: 400 }
        );
    }
    const responseData : JsonResponse = {
      success: true,
      message: 'Email sent successfully',
      data: response,

    }

    return NextResponse.json(
    responseData,
    { status: 200 }
    );
  } catch (error) {
    const apiError = new ApiError(error);

    logger.error({
      message: "Email sending error",
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
