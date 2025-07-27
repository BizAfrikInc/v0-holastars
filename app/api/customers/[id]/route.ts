import { NextRequest, NextResponse } from "next/server";
import { customersRepository } from "@/lib/db/repositories/customers-repository";
import { ApiError, HttpException } from "@/lib/errors/api-errors";
import { updateCustomerSchema } from "@/lib/helpers/validation-types"


export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id}=  await params
    const customer = await customersRepository.findById(id);
    if (!customer) throw new HttpException(404, "Customer not found");
    return NextResponse.json({ success: true, message: "Customer fetched", data: customer });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id}=  await params
    const payload = updateCustomerSchema.parse(await req.json());
    const updated = await customersRepository.update(id, payload);
    return NextResponse.json({ success: true, message: "Customer updated", data: updated });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id}=  await params
    const ok = await customersRepository.delete(id);
    if (!ok) throw new HttpException(404, "Customer not found");
    return NextResponse.json({ success: true, message: "Customer deleted" });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}
