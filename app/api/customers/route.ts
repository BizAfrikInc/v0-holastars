import { NextRequest, NextResponse } from "next/server";
import { customersRepository } from "@/lib/db/repositories/customers-repository";
import { ApiError } from "@/lib/errors/api-errors";
import { insertCustomerSchema } from "@/lib/helpers/validation-types"


export async function POST(req: NextRequest) {
  try {
    const data = insertCustomerSchema.parse(await req.json());
    const created = await customersRepository.create(data);
    return NextResponse.json({ success: true, message: "Customer created", data: created }, { status: 201 });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}

export async function GET() {
  try {
    const list = await customersRepository.findAll();
    return NextResponse.json({ success: true, message: "All customers", data: list });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}
