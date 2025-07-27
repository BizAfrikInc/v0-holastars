import { NextRequest, NextResponse } from 'next/server';
import { signJwt, verifyJwt } from '@/lib/services/jwt';
import { logger } from "@/lib/services/logging/logger"

export async function POST(req: NextRequest) {
  try {
    const oldToken = req.cookies.get('auth_token')?.value;
    if (!oldToken) return NextResponse.json({ error: 'No token found' }, { status: 401 });

    const payload = await verifyJwt(oldToken);
    if (!payload) return NextResponse.json({ error: 'Token expired or invalid' }, { status: 401 });

    const newToken = await signJwt({ userId: payload.userId, email: payload.email });

    const response = NextResponse.json({ message: 'Token refreshed' });
    response.cookies.set('auth_token', newToken, {
      httpOnly: true,
      secure: true,
      sameSite: 'strict',
      path: '/',
      maxAge: 7 * 24 * 60 * 60,  // 7 days
    });

    return response;
  } catch (error) {
    logger.error({
      message: 'Refresh token error',
      method: req.method,
      url: req.url,
      userAgent: req.headers.get('user-agent'),
      error: error instanceof Error ? error.message : 'An unknown error occurred',
      timestamp: new Date().toISOString(),
    })
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
