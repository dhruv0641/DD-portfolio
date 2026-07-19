import { db } from '@/db';
import { rateLimits } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { NextRequest } from 'next/server';

// ════════════════════════════════════════════════════════════════════════════
// IP DETECTION UTILITY
// ════════════════════════════════════════════════════════════════════════════
export function getClientIp(req: NextRequest): string {
  // Check common headers for proxy setups
  const cfConnectingIp = req.headers.get('cf-connecting-ip');
  const xForwardedFor = req.headers.get('x-forwarded-for');
  const xRealIp = req.headers.get('x-real-ip');

  if (cfConnectingIp) {
    return cfConnectingIp.trim();
  }

  if (xForwardedFor) {
    // x-forwarded-for can contain multiple comma-separated IPs. First is the client.
    const parts = xForwardedFor.split(',');
    return parts[0].trim();
  }

  if (xRealIp) {
    return xRealIp.trim();
  }

  return '127.0.0.1'; // Localhost fallback
}

// ════════════════════════════════════════════════════════════════════════════
// RATE LIMIT CHECK ENGINE (2 requests / 1 hour / IP)
// ════════════════════════════════════════════════════════════════════════════
const RATE_LIMIT_WINDOW = 3600 * 1000; // 1 hour in milliseconds
const MAX_REQUESTS = 2;

export interface RateLimitStatus {
  allowed: boolean;
  remaining: number;
  resetTime: number; // timestamp
}

export async function checkRateLimit(ip: string, increment = false): Promise<RateLimitStatus> {
  const now = Date.now();

  // Retrieve existing record from SQLite
  const records = await db.select().from(rateLimits).where(eq(rateLimits.ip, ip)).limit(1);
  const record = records[0];

  if (!record) {
    // First time visitor
    if (increment) {
      await db.insert(rateLimits).values({
        ip,
        count: 1,
        firstRequestTime: now,
        resetTime: now + RATE_LIMIT_WINDOW,
      });
      return { allowed: true, remaining: MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT_WINDOW };
    }
    return { allowed: true, remaining: MAX_REQUESTS, resetTime: now + RATE_LIMIT_WINDOW };
  }

  // Check if window has expired
  if (now > record.resetTime) {
    // Window expired — reset tracking
    if (increment) {
      await db
        .update(rateLimits)
        .set({
          count: 1,
          firstRequestTime: now,
          resetTime: now + RATE_LIMIT_WINDOW,
        })
        .where(eq(rateLimits.ip, ip));
      return { allowed: true, remaining: MAX_REQUESTS - 1, resetTime: now + RATE_LIMIT_WINDOW };
    } else {
      // Just checking, show reset state (2 remaining)
      return { allowed: true, remaining: MAX_REQUESTS, resetTime: now + RATE_LIMIT_WINDOW };
    }
  }

  // Within active window — verify request count
  if (record.count >= MAX_REQUESTS) {
    return {
      allowed: false,
      remaining: 0,
      resetTime: record.resetTime,
    };
  }

  // Increment if requested
  if (increment) {
    const newCount = record.count + 1;
    await db
      .update(rateLimits)
      .set({ count: newCount })
      .where(eq(rateLimits.ip, ip));
    return {
      allowed: true,
      remaining: MAX_REQUESTS - newCount,
      resetTime: record.resetTime,
    };
  }

  return {
    allowed: true,
    remaining: MAX_REQUESTS - record.count,
    resetTime: record.resetTime,
  };
}
