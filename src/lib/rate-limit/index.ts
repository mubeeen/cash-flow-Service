type RateLimitEntry = {
  count: number;
  resetTime: number;
};

type RateLimitResult = {
  allowed: boolean;
  limit: number;
  remaining: number;
  resetTime: number;
};

const store = new Map<string, RateLimitEntry>();

const WINDOW_MS = 15 * 60 * 1000; // 15 minutes
const MAX_REQUESTS = 100;          // per window

export function rateLimit(ip: string): RateLimitResult {
  const now = Date.now();
  const entry = store.get(ip);

  // First request or window expired — reset
  if (!entry || now > entry.resetTime) {
    store.set(ip, { count: 1, resetTime: now + WINDOW_MS });
    return { allowed: true, limit: MAX_REQUESTS, remaining: MAX_REQUESTS - 1, resetTime: now + WINDOW_MS };
  }

  // Within window — increment
  entry.count++;
  const remaining = Math.max(0, MAX_REQUESTS - entry.count);

  return {
    allowed: entry.count <= MAX_REQUESTS,
    limit: MAX_REQUESTS,
    remaining,
    resetTime: entry.resetTime,
  };
}
