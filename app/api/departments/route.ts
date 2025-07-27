import { NextRequest, NextResponse } from "next/server";
import { departmentRepository } from "@/lib/db/repositories/departments-repository";
import { ApiError } from "@/lib/errors/api-errors";
import { logger } from "@/lib/services/logging/logger";
import { insertDepartmentSchema } from "@/lib/helpers/validation-types"


export async function POST(req: NextRequest) {
  try {
    const data = insertDepartmentSchema.parse(await req.json());
    const result = await departmentRepository.create(data);

    return NextResponse.json({
      success: true,
      message: "Department created",
      data: result,
    }, { status: 201 });

  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Department creation failed",
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

export async function GET(req: NextRequest) {
  try {
    const all = await departmentRepository.findAll();
    return NextResponse.json({
      success: true,
      message: "Fetched all departments",
      data: all,
    });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Fetching all departments",
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
