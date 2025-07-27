import { jwtVerify, SignJWT } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'my-very-secure-secret');
export interface JwtPayload {
  userId: string;
  email: string;
  [key: string]: string | number;
}

export async function signJwt(payload: JwtPayload, expDuration = '7d'): Promise<string> {
  return await new SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setExpirationTime(expDuration)
    .sign(JWT_SECRET);
}

export async function verifyJwt(token: string): Promise<JwtPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as JwtPayload;
  } catch {
    return null;
  }
}
