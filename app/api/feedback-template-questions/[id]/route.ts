import { NextRequest, NextResponse } from "next/server";
import { templateQuestionsRepository } from "@/lib/db/repositories/template-questions-repository";
import { ApiError } from "@/lib/errors/api-errors";
import { updateTemplateQuestionSchema } from "@/lib/helpers/validation-types"

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params
    const data =  updateTemplateQuestionSchema.parse(await req.json());
    const updated = await templateQuestionsRepository.update(id, data);
    return NextResponse.json({ success: true, message: "Question updated", data: updated });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params
    const success = await templateQuestionsRepository.delete(id);
    return NextResponse.json({ success, message: "Question deleted" });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}
