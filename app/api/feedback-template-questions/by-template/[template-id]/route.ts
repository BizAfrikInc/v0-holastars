import { NextRequest, NextResponse } from "next/server";
import { templateQuestionsRepository } from "@/lib/db/repositories/template-questions-repository";
import { ApiError } from "@/lib/errors/api-errors";

export async function GET(_: NextRequest, { params }: { params: Promise<{ templateId: string }> }) {
  try {
    const {templateId} = await params
    const questions = await templateQuestionsRepository.findByTemplateId(templateId);
    return NextResponse.json({ success: true, message: "Questions retrieved", data: questions });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}
