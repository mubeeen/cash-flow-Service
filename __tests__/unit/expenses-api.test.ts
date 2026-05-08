/**
 * @jest-environment node
 */
import { prisma } from '@/lib/db';
import { singleExpense } from '../mocks/expense/expense_response_data';
import { validCreateExpenseInput, invalidCreateExpenseInput } from '../mocks/expense/expense_request_data';

jest.mock('@/lib/db', () => ({
  prisma: {
    expense: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
  },
}));

import { GET, POST } from '@/app/api/v1/expenses/route';

describe('GET /api/expenses', () => {
  it('returns expenses with pagination', async () => {
    (prisma.expense.findMany as jest.Mock).mockResolvedValue([singleExpense]);
    (prisma.expense.count as jest.Mock).mockResolvedValue(1);

    const request = new Request('http://localhost/api/expenses?page=1&limit=5');
    const response = await GET(request);
    const body = await response.json();

    expect(response.status).toBe(200);
    expect(body.data).toHaveLength(1);
    expect(body.data[0].item).toBe('Coffee');
    expect(body.meta.total).toBe(1);
  });

  it('filters by search term', async () => {
    (prisma.expense.findMany as jest.Mock).mockResolvedValue([singleExpense]);
    (prisma.expense.count as jest.Mock).mockResolvedValue(1);

    const request = new Request('http://localhost/api/expenses?search=coffee');
    await GET(request);

    expect(prisma.expense.findMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: expect.objectContaining({
          item: { contains: 'coffee', mode: 'insensitive' },
        }),
      }),
    );
  });
});

describe('POST /api/expenses', () => {
  it('creates an expense with valid data', async () => {
    (prisma.expense.create as jest.Mock).mockResolvedValue(singleExpense);

    const request = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify(validCreateExpenseInput),
    });

    const response = await POST(request);
    expect(response.status).toBe(201);
  });

  it('returns 422 when fields are missing', async () => {
    const request = new Request('http://localhost/api/expenses', {
      method: 'POST',
      body: JSON.stringify(invalidCreateExpenseInput),
    });

    const response = await POST(request);
    expect(response.status).toBe(422);
  });
});
