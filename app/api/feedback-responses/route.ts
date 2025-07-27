import { NextRequest, NextResponse } from "next/server";
import { feedbackResponsesRepository } from "@/lib/db/repositories/feedback-responses-repository";
import { ApiError } from "@/lib/errors/api-errors";
import { insertResponseSchema } from "@/lib/helpers/validation-types"

export async function POST(req: NextRequest) {
  try {
    const data = insertResponseSchema.parse(await req.json());
    const saved = await feedbackResponsesRepository.create(data);
    return NextResponse.json({ success: true, message: "Response saved", data: saved }, { status: 201 });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}

export async function GET(req: NextRequest) {
  try {
    const biz = req.nextUrl.searchParams.get("businessId");
    if (!biz) throw new ApiError("businessId param required");
    const total = await feedbackResponsesRepository.countForBusiness(biz);
    return NextResponse.json({ success: true, message: "Total responses", data: { total } });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}
