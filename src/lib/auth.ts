import bcrypt from 'bcryptjs';
import * as jose from 'jose';
import { UserSession } from '@/types';
import { SESSION_COOKIE_NAME, FALLBACK_EMAIL } from './constants';

const JWT_SECRET = new TextEncoder().encode(
  process.env.ADMIN_JWT_SECRET || 'DHRUV_PORTFOLIO_SECURE_SECRET_FALLBACK_KEY_2026'
);

export async function hashPassword(password: string): Promise<string> {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePasswords(password: string, hash: string): Promise<boolean> {
  return bcrypt.compare(password, hash);
}

export async function encryptSession(payload: UserSession, expiresIn: string = '1d'): Promise<string> {
  return new jose.SignJWT({ ...payload })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(JWT_SECRET);
}

export async function decryptSession(token: string): Promise<UserSession | null> {
  try {
    const { payload } = await jose.jwtVerify(token, JWT_SECRET, {
      algorithms: ['HS256'],
    });
    return {
      userId: payload.userId as number,
      username: payload.username as string,
    };
  } catch {
    return null;
  }
}

export function getSessionCookieName() {
  return SESSION_COOKIE_NAME;
}

import { cookies } from 'next/headers';

export async function verifyAuthSession(): Promise<UserSession | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME);
    if (!token) return null;
    return decryptSession(token.value);
  } catch {
    return null;
  }
}

