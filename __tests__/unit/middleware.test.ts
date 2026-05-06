/**
 * @jest-environment node
 */
import { middleware } from '@/middleware';
import { NextRequest } from 'next/server';

jest.mock('uuid', () => ({ v4: () => 'test-request-id-123' }));

describe('Middleware - Request ID', () => {
  it('adds x-request-id header to response', () => {
    const request = new NextRequest('http://localhost/api/expenses');
    const response = middleware(request);

    expect(response.headers.get('x-request-id')).toBe('test-request-id-123');
  });

  it('uses client-provided x-request-id if present', () => {
    const request = new NextRequest('http://localhost/api/expenses', {
      headers: { 'x-request-id': 'client-id-456' },
    });
    const response = middleware(request);

    expect(response.headers.get('x-request-id')).toBe('client-id-456');
  });

  it('redirects to login for protected routes without session', () => {
    const request = new NextRequest('http://localhost/expenses');
    const response = middleware(request);

    expect(response.status).toBe(307);
    expect(response.headers.get('location')).toContain('/login');
    expect(response.headers.get('x-request-id')).toBe('test-request-id-123');
  });
});
