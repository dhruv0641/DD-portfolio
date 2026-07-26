import { getClientIp } from './validation';
import { activityService } from '@/services/activityService';

interface RateLimitBucket {
  tokens: number;
  lastRefill: number;
}

const rateLimitMap = new Map<string, RateLimitBucket>();

/**
 * Basic in-memory token-bucket rate limiter.
 * Defends against brute-force login attempts, spam emails, and file flooding.
 */
export async function rateLimit(
  actionKey: string,
  maxTokens: number,
  refillRatePerMinute: number
): Promise<{ allowed: boolean; error?: string }> {
  try {
    const ip = await getClientIp();
    const mapKey = `${ip}:${actionKey}`;
    const now = Date.now();

    let bucket = rateLimitMap.get(mapKey);

    if (!bucket) {
      bucket = { tokens: maxTokens, lastRefill: now };
    } else {
      // Calculate token refill based on elapsed time
      const elapsedMs = now - bucket.lastRefill;
      const refilledTokens = (elapsedMs * refillRatePerMinute) / (60 * 1000);
      bucket.tokens = Math.min(maxTokens, bucket.tokens + refilledTokens);
      bucket.lastRefill = now;
    }

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      rateLimitMap.set(mapKey, bucket);
      return { allowed: true };
    }

    // Log rate limit violation in the security log
    await activityService.logEvent({
      user_name: 'anonymous',
      action: 'RATE_LIMIT_VIOLATION',
      entity: 'SYSTEM',
      details: `Rate limit hit on action "${actionKey}" by IP ${ip}. Request rejected.`,
      ip_address: ip,
    });

    return { 
      allowed: false, 
      error: `Rate limit exceeded. Please wait before retrying this action.` 
    };
  } catch (err: any) {
    console.error('Rate limiting internal error:', err);
    return { allowed: true }; // Fallback to allowed on internal error to avoid breaking functionality
  }
}
