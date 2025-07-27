import { NextRequest, NextResponse } from 'next/server';
import { JsonResponse } from "@/lib/helpers/validation-types"

export async function POST(req: NextRequest) {
  const jsonResponse: JsonResponse = {
    success: true,
    message: 'Logout successful',
  }
  const response = NextResponse.json(jsonResponse, {status: 200});
  response.cookies.delete('auth_token');
  return response;
}
