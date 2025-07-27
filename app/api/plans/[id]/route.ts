import { NextRequest, NextResponse } from "next/server";
import { planRepository } from "@/lib/db/repositories/plans-repository";
import { ApiError, HttpException } from "@/lib/errors/api-errors";
import { planSchemas } from "@/lib/helpers/validation-types"

const updateSchema = planSchemas.update.partial().omit({ id: true });

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const record = await planRepository.findById(id);
    if (!record) throw new HttpException(404, "Plan not found");

    return NextResponse.json({ success: true, message: "Plan found", data: record });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const data = updateSchema.parse(await req.json());
    const updated = await planRepository.update(id, data);
    return NextResponse.json({ success: true, message: "Plan updated", data: updated });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const deleted = await planRepository.delete(id);
    if (!deleted) throw new HttpException(404, "Plan not found");

    return NextResponse.json({ success: true, message: "Plan deleted" });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}
