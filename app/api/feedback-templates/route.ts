import { NextRequest, NextResponse } from "next/server";
import { feedbackTemplatesRepository } from "@/lib/db/repositories/feedback-template-repository";
import { ApiError } from "@/lib/errors/api-errors";
import { createTemplateWithQuestionsSchema } from "@/lib/helpers/validation-types"


export async function POST(req: NextRequest) {
  try {
    const data = createTemplateWithQuestionsSchema.parse(await req.json())
    const created = await feedbackTemplatesRepository.createTemplateAndQuestions(data);
    return NextResponse.json({ success: true, message: "Template created and associated  questions created successfully.", data: created }, { status: 201 });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}

export async function GET(req: NextRequest) {
  try {
    const templates = await feedbackTemplatesRepository.findAllTemplatesAndQuestions();
    return NextResponse.json({ success: true, message: "Templates retrieved", data: templates });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}
