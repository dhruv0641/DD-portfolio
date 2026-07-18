'use server';

import { cookies } from 'next/headers';
import { db } from '@/db';
import * as schema from '@/db/schema';
import { eq } from 'drizzle-orm';
import { comparePasswords, encryptSession, getSessionCookieName } from '@/lib/auth';

export async function loginAdmin(formData: any) {
  try {
    const { username, password } = formData;

    if (!username || !password) {
      return { success: false, error: 'Username and password are required.' };
    }

    // Query user
    const usersList = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .limit(1);

    const user = usersList[0];
    if (!user) {
      return { success: false, error: 'Access denied: Invalid credentials.' };
    }

    // Match password hash
    const isValid = await comparePasswords(password, user.passwordHash);
    if (!isValid) {
      return { success: false, error: 'Access denied: Invalid credentials.' };
    }

    // Encrypt cookie payload
    const token = await encryptSession({
      userId: user.id,
      username: user.username,
    });

    // Write secure cookie
    const cookieStore = await cookies();
    cookieStore.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 24 hours
    });

    return { success: true };
  } catch (error) {
    console.error('Login action error:', error);
    return { success: false, error: 'Server authentication pipeline error.' };
  }
}

export async function logoutAdmin() {
  const cookieStore = await cookies();
  cookieStore.delete(getSessionCookieName());
  return { success: true };
}
