import { NextRequest, NextResponse } from 'next/server';
import { joinWaitlistFlag } from '@/flags';
import { verifyJwt } from "@/lib/services/jwt"

// **Level 1: Feature Flags**
async function checkFeatureFlags(request: NextRequest): Promise<Response | null> {
  const { pathname } = request.nextUrl;
  const joinWaitlistEnabled = await joinWaitlistFlag();


  const prefixNotAllowedPaths = [
    '/auth',
  ];

  const isPrefixMatch = prefixNotAllowedPaths.some(path => pathname.startsWith(path));
  if (joinWaitlistEnabled && isPrefixMatch ) {
    return NextResponse.redirect(new URL('/waitlist', request.url));
  }

  return null;
}

// **Level 2: Token Handling**
async function checkToken(request: NextRequest): Promise<Response | null> {
  const { pathname } = request.nextUrl;

  // Paths that don't require a token
  const prefixAllowedPaths = [
    '/auth',
    '/forgot-password',
    '/reset-password',
    '/verify-email',
    '/api/auth',
    '/api/auth/logout',
    '/api/auth/refresh',
    '/api/health',
    '/api/send_emails',
    '/waitlist',
    '/about',
    '/contact',
    '/faq',
    '/home',
    '/pricing',
    '/resources',
    '/affiliate',
    '/features'

  ];

  const exactAllowedPaths = ['/'];

  const isExactMatch = exactAllowedPaths.includes(pathname);
  const isPrefixMatch = prefixAllowedPaths.some(path => pathname.startsWith(path));
  const isAllowedPath = isExactMatch || isPrefixMatch;

  if (isAllowedPath) return null;

  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    return NextResponse.redirect(new URL('/auth', request.url));
  }

  const payload = await verifyJwt(token);
  if (!payload) {
    const response = NextResponse.redirect(new URL('/auth', request.url));
    response.cookies.delete('auth_token');
    return response;
  }

  // Optionally, add user info to headers for downstream services
  request.headers.set('x-user-id', payload.userId);
  request.headers.set('x-email', payload.email);

  return null;
}

// **Level 3: Roles and Permissions (Coming soon)**
async function checkRolesAndPermissions(request: NextRequest): Promise<Response | null> {
  // Placeholder for future role-based checks
  return null;
}

// **Export Levels in Order**
export const restrictionLevels = [
  checkFeatureFlags,
  checkToken,
  checkRolesAndPermissions,
];
