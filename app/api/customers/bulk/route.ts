import { NextRequest, NextResponse } from "next/server";
import { customersRepository } from "@/lib/db/repositories/customers-repository";
import { NewCustomer } from "@/lib/db/schema/customers"
import { ApiError } from "@/lib/errors/api-errors";
import { CreateCustomerRequest, insertCustomerSchema } from "@/lib/helpers/validation-types"

export async function POST(req: NextRequest) {
  try {
    const rows = await req.json() as CreateCustomerRequest[]
    const validated = rows.map((r: unknown) => insertCustomerSchema.parse(r));
    const uniqueByEmailAndBusiness = new Map<string, NewCustomer>();

    for (const customer of validated) {
      const key = `${customer.email}-${customer.businessId}`;
      if (!uniqueByEmailAndBusiness.has(key)) {
        uniqueByEmailAndBusiness.set(key, customer);
      }
    }

    const deduplicated = Array.from(uniqueByEmailAndBusiness.values());
    const created = await customersRepository.createMany(deduplicated);
    return NextResponse.json({ success: true, message: `${created.length} customers imported`, data: created }, { status: 201 });
  } catch (e) {
    const err = new ApiError(e);
    return NextResponse.json({ success: false, message: err.message, data: err.toJson() }, { status: err.statusCode });
  }
}
