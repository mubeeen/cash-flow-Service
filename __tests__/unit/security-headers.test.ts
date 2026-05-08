/**
 * @jest-environment node
 */

// eslint-disable-next-line @typescript-eslint/no-require-imports
const nextConfig = require('../../next.config.js');

describe('Security Headers', () => {
  it('configures security headers for all routes', async () => {
    const headers = await nextConfig.headers();

    expect(headers).toHaveLength(1);
    expect(headers[0].source).toBe('/(.*)');

    const headerMap = Object.fromEntries(
      headers[0].headers.map((h: { key: string; value: string }) => [h.key, h.value]),
    );

    expect(headerMap['X-Content-Type-Options']).toBe('nosniff');
    expect(headerMap['X-Frame-Options']).toBe('DENY');
    expect(headerMap['X-XSS-Protection']).toBe('1; mode=block');
    expect(headerMap['Referrer-Policy']).toBe('strict-origin-when-cross-origin');
    expect(headerMap['Permissions-Policy']).toBe('camera=(), microphone=(), geolocation=()');
    expect(headerMap['Strict-Transport-Security']).toBe('max-age=31536000; includeSubDomains');
  });
});
