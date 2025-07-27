import { NextRequest, NextResponse } from "next/server";
import { userPlansRepository } from "@/lib/db/repositories/users-plans-repository"
import { ApiError } from "@/lib/errors/api-errors";
import { userPlanSchemas } from "@/lib/helpers/validation-types"

const insertSchema = userPlanSchemas.insert.omit({ id: true });

export async function POST(req: NextRequest) {
  try {
    const data = insertSchema.parse(await req.json());
    const record = await userPlansRepository.create(data);
    return NextResponse.json({ success: true, message: "UserPlan created", data: record }, { status: 201 });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function GET() {
  try {
    const results = await userPlansRepository.findAll();
    return NextResponse.json({ success: true, message: "UserPlans retrieved", data: results });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}
