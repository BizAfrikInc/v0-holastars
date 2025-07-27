import { NextRequest, NextResponse } from "next/server";
import { departmentRepository } from "@/lib/db/repositories/departments-repository";
import { ApiError, HttpException } from "@/lib/errors/api-errors";
import { updateDepartmentSchema } from "@/lib/helpers/validation-types"
import { logger } from "@/lib/services/logging/logger"


export async function GET(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const record = await departmentRepository.findById(id);
    if (!record) throw new HttpException(404, "Department not found");

    return NextResponse.json({ success: true, message: "Department found", data: record });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Find Department details",
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
    const data = updateDepartmentSchema.parse(await req.json());
    const updated = await departmentRepository.update(id, data);
    return NextResponse.json({ success: true, message: "Department updated", data: updated });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Update Department details",
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
    const deleted = await departmentRepository.delete(id);
    if (!deleted) throw new HttpException(404, "Department not found");

    return NextResponse.json({ success: true, message: "Department deleted", data: null });
  } catch (error) {
    const apiError = new ApiError(error);
    logger.error({
      message: "Delete a Department",
      method: req.method,
      url: req.url,
      userAgent: req.headers.get("user-agent"),
      error: apiError.message,
      timestamp: new Date().toISOString(),
    });
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}
