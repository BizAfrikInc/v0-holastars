import { NextRequest, NextResponse } from "next/server";
import { subscriptionsRepository } from "@/lib/db/repositories/subscriptions-repository";
import { ApiError, HttpException } from "@/lib/errors/api-errors";
import { subscriptionSchemas } from "@/lib/helpers/validation-types"

const updateSchema = subscriptionSchemas.update.partial().omit({ id: true });

export async function GET(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params;
    const sub = await subscriptionsRepository.findById(id);
    if (!sub) throw new HttpException(404, "Subscription not found");
    return NextResponse.json({ success: true, message: "Subscription fetched", data: sub });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function PUT(req: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const data = updateSchema.parse(await req.json());
    const {id} = await params;
    const updated = await subscriptionsRepository.update(id, data);
    return NextResponse.json({ success: true, message: "Subscription updated", data: updated });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function DELETE(_: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const {id} = await params;
    const deleted = await subscriptionsRepository.delete(id);
    if (!deleted) throw new HttpException(404, "Subscription not found");
    return NextResponse.json({ success: true, message: "Subscription deleted" });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}
