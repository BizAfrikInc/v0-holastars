import { NextRequest, NextResponse } from "next/server";
import { subscriptionsRepository } from "@/lib/db/repositories/subscriptions-repository";
import { ApiError } from "@/lib/errors/api-errors";
import { subscriptionSchemas } from "@/lib/helpers/validation-types"

const insertSchema = subscriptionSchemas.insert.omit({ id: true });

export async function POST(req: NextRequest) {
  try {
    const data = insertSchema.parse(await req.json());
    const sub = await subscriptionsRepository.create(data);
    return NextResponse.json({ success: true, message: "Subscription created", data: sub }, { status: 201 });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}

export async function GET() {
  try {
    const subs = await subscriptionsRepository.findAll();
    return NextResponse.json({ success: true, message: "Subscriptions fetched", data: subs });
  } catch (error) {
    const apiError = new ApiError(error);
    return NextResponse.json({ success: false, message: apiError.message, data: apiError.toJson() }, { status: apiError.statusCode });
  }
}
