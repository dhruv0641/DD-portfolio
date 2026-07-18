'use server';

import { cookies } from 'next/headers';
import { encryptSession, decryptSession } from '@/lib/auth';
import { SESSION_COOKIE_NAME } from '@/lib/constants';
import { authService } from '@/services/authService';
import { activityService } from '@/services/activityService';
import { rateLimit } from '@/lib/rateLimiter';
import { getClientIp, sanitizeString } from '@/lib/validation';

export async function loginAdmin(formData: Record<string, any>) {
  try {
    // 1. Rate Limiting check: 5 attempts per 15 minutes (approx 0.3 refill rate)
    const rateCheck = await rateLimit('login', 5, 0.3);
    if (!rateCheck.allowed) {
      return { success: false, error: rateCheck.error || 'Too many login attempts.' };
    }

    const { username, password, rememberMe } = formData;
    if (!username || !password) {
      return { success: false, error: 'Username and password are required.' };
    }

    // Clean inputs
    const cleanUsername = sanitizeString(username.trim());
    const ipAddress = await getClientIp();

    // Authenticate via Supabase Auth Service
    const authResult = await authService.signIn(cleanUsername, password);
    if (!authResult.success) {
      await activityService.logEvent({
        user_name: cleanUsername,
        action: 'FAILED_LOGIN',
        entity: 'AUTH',
        details: 'Attempted login with invalid credentials.',
        ip_address: ipAddress,
      });
      return { success: false, error: 'Access denied: Invalid credentials.' };
    }

    const sessionData = authResult.session;
    const userUuid = sessionData?.user?.id || 'admin-uuid';

    // Determine cookie duration
    const isRemembered = rememberMe === 'true' || rememberMe === true;
    const tokenExpiry = isRemembered ? '30d' : '1d';
    const cookieMaxAge = isRemembered ? 60 * 60 * 24 * 30 : 60 * 60 * 24;

    // Encrypt cookie payload using Supabase Auth UUID
    const token = await encryptSession({
      userId: userUuid,
      username: cleanUsername,
    }, tokenExpiry);

    // Write secure cookie
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: cookieMaxAge,
    });

    await activityService.logEvent({
      user_name: cleanUsername,
      action: 'LOGIN',
      entity: 'AUTH',
      details: `Successful administrator authentication. Remember me: ${isRemembered}`,
      ip_address: ipAddress,
    });

    return { success: true };
  } catch (error) {
    console.error('Login action error:', error);
    return { success: false, error: 'Authentication pipeline error occurred.' };
  }
}

export async function logoutAdmin() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME);
    const ipAddress = await getClientIp();
    if (token) {
      const session = await decryptSession(token.value);
      if (session) {
        await activityService.logEvent({
          user_name: session.username,
          action: 'LOGOUT',
          entity: 'AUTH',
          details: 'User logged out successfully.',
          ip_address: ipAddress,
        });
      }
    }
    cookieStore.delete(SESSION_COOKIE_NAME);
    return { success: true };
  } catch (error) {
    console.error('Logout error:', error);
    return { success: true }; // Still return success to allow redirecting
  }
}

export async function requestPasswordReset(username: string, redirectTo: string) {
  try {
    // Rate Limiting: 3 requests per hour
    const rateCheck = await rateLimit('password_reset_request', 3, 0.05);
    if (!rateCheck.allowed) {
      return { success: false, error: rateCheck.error || 'Too many requests.' };
    }

    if (!username) {
      return { success: false, error: 'Username is required.' };
    }

    const cleanUsername = sanitizeString(username.trim());
    const ipAddress = await getClientIp();

    const result = await authService.resetPasswordForEmail(cleanUsername, redirectTo);
    if (!result.success) {
      return { success: false, error: 'Password reset request could not be processed.' };
    }

    await activityService.logEvent({
      user_name: cleanUsername,
      action: 'FORGOT_PASSWORD_REQUEST',
      entity: 'AUTH',
      details: `Password reset request submitted for ${cleanUsername}`,
      ip_address: ipAddress,
    });
    return { success: true };
  } catch (error: any) {
    console.error('Request reset error:', error);
    return { success: false, error: 'Failed to request password reset.' };
  }
}

export async function performPasswordReset(password: string) {
  try {
    // Rate Limiting: 5 updates per hour
    const rateCheck = await rateLimit('password_reset_perform', 5, 0.08);
    if (!rateCheck.allowed) {
      return { success: false, error: rateCheck.error || 'Too many requests.' };
    }

    if (!password || password.length < 8) {
      return { success: false, error: 'Password must be at least 8 characters long.' };
    }

    const ipAddress = await getClientIp();
    const result = await authService.updatePassword(password);
    if (!result.success) {
      return { success: false, error: 'Failed to update password.' };
    }

    await activityService.logEvent({
      user_name: 'admin',
      action: 'PASSWORD_RESET',
      entity: 'AUTH',
      details: 'Password was successfully reset/updated by user.',
      ip_address: ipAddress,
    });
    return { success: true };
  } catch (error: any) {
    console.error('Perform reset error:', error);
    return { success: false, error: 'Failed to update password.' };
  }
}
