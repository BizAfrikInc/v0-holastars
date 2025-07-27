import { NextRequest, NextResponse } from "next/server";
import { planPermissionsRepository } from "@/lib/db/repositories/plans-permissions-repository"
import { ApiError, HttpException } from "@/lib/errors/api-errors";
import { planPermissionSchemas } from "@/lib/helpers/validation-types"

const updateSchema = planPermissionSchemas.update.partial().omit({ id: true });

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {

    const {id} = await params
    const data = await planPermissionsRepository.findById(id);
    if (!data) throw new HttpException(404, "Plan permission not found");
    return NextResponse.json({ success: true, message: "Fetched", data });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const body = updateSchema.parse(await req.json());
    const {id} = await params
    const updated = await planPermissionsRepository.update(id, body);
    return NextResponse.json({ success: true, message: "Updated successfully", data: updated });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params
    const deleted = await planPermissionsRepository.delete(id);
    if (!deleted) throw new HttpException(404, "Plan permission not found");
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}
