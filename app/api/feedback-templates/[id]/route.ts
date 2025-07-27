import { NextRequest, NextResponse } from "next/server";
import { feedbackTemplatesRepository } from "@/lib/db/repositories/feedback-template-repository";
import { ApiError, HttpException } from "@/lib/errors/api-errors";
import { updateFeedbackTemplateSchema } from "@/lib/helpers/validation-types"

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params
    const template = await feedbackTemplatesRepository.findTemplateAndQuestionsById(id);
    if (!template) throw new HttpException(404, "Template not found");
    return NextResponse.json({ success: true, message: "Template retrieved", data: template });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params
    const payload = updateFeedbackTemplateSchema.parse(await req.json());
    const updated = await feedbackTemplatesRepository.update(id, payload);
    return NextResponse.json({ success: true, message: "Template updated", data: updated });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}

export async function DELETE(_: NextRequest, { params }: { params:Promise <{ id: string }> }) {
  try {
    const {id} = await params
    const success = await feedbackTemplatesRepository.delete(id);
    if (!success) throw new HttpException(404, "Template not found");
    return NextResponse.json({ success: true, message: "Template deleted" });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}
