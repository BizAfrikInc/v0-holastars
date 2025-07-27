import { NextRequest, NextResponse } from 'next/server';
import { restrictionLevels } from "@/lib/services/authorization/restrictions"

export async function middleware(request: NextRequest) {
  for (const level of restrictionLevels) {
    const response = await level(request);
    if (response) return response;
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|images).*)',
  ],
};
