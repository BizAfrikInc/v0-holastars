import { NextRequest, NextResponse } from "next/server";
import { planRepository } from "@/lib/db/repositories/plans-repository";
import { ApiError } from "@/lib/errors/api-errors";
import { planSchemas } from "@/lib/helpers/validation-types"

const insertSchema = planSchemas.insert.omit({ id: true });

export async function POST(req: NextRequest) {
  try {
    const data = insertSchema.parse(await req.json());
    const plan = await planRepository.create(data);

    return NextResponse.json({
      success: true,
      message: "Plan created successfully",
      data: plan,
    }, { status: 201 });

  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function GET() {
  try {
    const all = await planRepository.findAll();
    return NextResponse.json({
      success: true,
      message: "Plans retrieved successfully",
      data: all,
    });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}
