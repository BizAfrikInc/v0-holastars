import { NextRequest, NextResponse } from "next/server";
import { locationRepository } from "@/lib/db/repositories/locations-repository";
import { ApiError, HttpException } from "@/lib/errors/api-errors";
import { updateLocationSchema } from "@/lib/helpers/validation-types"


export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const location = await locationRepository.findById(id);
    if (!location) throw new HttpException(404, "Location not found");

    return NextResponse.json({
      success: true,
      message: "Location found",
      data: location,
    });

  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const data = updateLocationSchema.parse(await req.json());
    const updated = await locationRepository.update(id, data);
    return NextResponse.json({ success: true, message: "Location updated", data: updated });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const deleted = await locationRepository.delete(id);
    if (!deleted) throw new HttpException(404, "Location not found");

    return NextResponse.json({ success: true, message: "Location deleted", data: null });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}
