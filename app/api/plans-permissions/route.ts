import { NextRequest, NextResponse } from "next/server";
import { planPermissionsRepository } from "@/lib/db/repositories/plans-permissions-repository"
import { ApiError } from "@/lib/errors/api-errors";
import { planPermissionSchemas } from "@/lib/helpers/validation-types"

const insertSchema = planPermissionSchemas.insert.omit({ id: true });

export async function POST(req: NextRequest) {
  try {
    const data = insertSchema.parse(await req.json());
    const created = await planPermissionsRepository.create(data);
    return NextResponse.json({ success: true, message: "Permission linked to plan", data: created }, { status: 201 });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function GET() {
  try {
    const data = await planPermissionsRepository.findAll();
    return NextResponse.json({ success: true, message: "Fetched all plan permissions", data });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}
