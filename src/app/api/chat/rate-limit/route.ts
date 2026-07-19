import { NextRequest, NextResponse } from 'next/server';
import { getClientIp, checkRateLimit } from '@/lib/rateLimit';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(req: NextRequest) {
  try {
    const ip = getClientIp(req);
    const status = await checkRateLimit(ip, false);

    return NextResponse.json({
      ip,
      remaining: status.remaining,
      resetTime: status.resetTime,
      allowed: status.allowed,
    });
  } catch (err: any) {
    console.error('Rate limit query failed:', err);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
