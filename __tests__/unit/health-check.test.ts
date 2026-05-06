/**
 * @jest-environment node
 */

jest.mock('@/lib/db', () => ({
  prisma: {
    $queryRaw: jest.fn(),
  },
}));

import { prisma } from '@/lib/db';
import { GET as health } from '@/app/api/health/route';
import { GET as ready } from '@/app/api/ready/route';

describe('GET /api/health', () => {
  it('returns 200 with status ok', async () => {
    const response = await health();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(body.timestamp).toBeDefined();
  });
});

describe('GET /api/ready', () => {
  it('returns 200 when database is connected', async () => {
    (prisma.$queryRaw as jest.Mock).mockResolvedValue([{ '?column?': 1 }]);

    const response = await ready();
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.status).toBe('ok');
    expect(body.database).toBe('connected');
  });

  it('returns 503 when database is disconnected', async () => {
    (prisma.$queryRaw as jest.Mock).mockRejectedValue(new Error('Connection refused'));

    const response = await ready();
    const body = await response.json();

    expect(response.status).toBe(503);
    expect(body.status).toBe('unavailable');
    expect(body.database).toBe('disconnected');
  });
});
