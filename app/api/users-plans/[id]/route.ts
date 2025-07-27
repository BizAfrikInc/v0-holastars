import { NextRequest, NextResponse } from "next/server";
import { userPlansRepository } from "@/lib/db/repositories/users-plans-repository"
import { ApiError, HttpException } from "@/lib/errors/api-errors";
import { userPlanSchemas } from "@/lib/helpers/validation-types"

const updateSchema = userPlanSchemas.update.partial().omit({ id: true });

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params;
    const record = await userPlansRepository.findById(id);
    if (!record) throw new HttpException(404, "UserPlan not found");
    return NextResponse.json({ success: true, message: "Record found", data: record });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params;
    const data = updateSchema.parse(await req.json());
    const updated = await userPlansRepository.update(id, data);
    return NextResponse.json({ success: true, message: "Record updated", data: updated });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params;
    const deleted = await userPlansRepository.delete(id);
    if (!deleted) throw new HttpException(404, "UserPlan not found");
    return NextResponse.json({ success: true, message: "Record deleted" });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}
