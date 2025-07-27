import { NextRequest, NextResponse } from "next/server"
import { templateQuestionsRepository } from "@/lib/db/repositories/template-questions-repository"
import { ApiError } from "@/lib/errors/api-errors"
import {insertTemplateQuestionSchema } from "@/lib/helpers/validation-types"

export async function POST(req: NextRequest) {
  try {
    const [data] = insertTemplateQuestionSchema.parse(await req.json());
    if(!data) return NextResponse.json({success: false, message: 'Template question validation failed'})
    const created = await templateQuestionsRepository.create(data);
    return NextResponse.json({ success: true, message: "Template Question Added", data: created }, { status: 201 });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}

export async function GET(req: NextRequest) {
  try {
    const templates = await templateQuestionsRepository.findAll();
    return NextResponse.json({ success: true, message: "Template Questions retrieved", data: templates });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}