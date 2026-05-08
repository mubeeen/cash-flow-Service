/**
 * @jest-environment node
 */

jest.mock('@/lib/config', () => ({
  config: { rateLimit: { max: 100 } },
}));

import { rateLimit } from '@/lib/rate-limit';

describe('Rate Limiter', () => {
  it('allows requests within the limit', () => {
    const result = rateLimit('192.168.1.1');

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(99);
    expect(result.limit).toBe(100);
  });

  it('tracks count across multiple requests', () => {
    const ip = '192.168.1.2';

    rateLimit(ip); // 1
    rateLimit(ip); // 2
    const result = rateLimit(ip); // 3

    expect(result.allowed).toBe(true);
    expect(result.remaining).toBe(97);
  });

  it('blocks when limit is exceeded', () => {
    const ip = '192.168.1.3';

    // Exhaust the limit
    for (let i = 0; i < 100; i++) {
      rateLimit(ip);
    }

    // 101st request should be blocked
    const result = rateLimit(ip);

    expect(result.allowed).toBe(false);
    expect(result.remaining).toBe(0);
  });
});
