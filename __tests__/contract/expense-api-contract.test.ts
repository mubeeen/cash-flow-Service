/**
 * @jest-environment node
 * 
 * Contract Tests
 * 
 * These tests verify the API response SHAPE — not business logic.
 * If someone changes a field name or removes a property,
 * this test fails, protecting all API consumers.
 */

jest.mock('@/lib/db', () => ({
  prisma: {
    expense: {
      findMany: jest.fn().mockResolvedValue([
        { id: '1', item: 'Coffee', price: 5.5, date: new Date('2026-01-01'), categoryId: 'c1', createdAt: new Date('2026-01-01'), category: { id: 'c1', name: 'Food' } },
      ]),
      count: jest.fn().mockResolvedValue(1),
    },
  },
}));

jest.mock('@/lib/config', () => ({
  config: { rateLimit: { max: 1000 }, log: { level: 'silent' }, otel: { endpoint: '' }, db: { url: '' } },
}));

import { GET } from '@/app/api/v1/expenses/route';

describe('Contract: GET /api/v1/expenses', () => {
  it('returns { data: [], meta: {} } envelope', async () => {
    const response = await GET(new Request('http://localhost/api/v1/expenses?page=1&limit=10'));
    const body = await response.json();

    // Verify envelope structure exists
    expect(body).toHaveProperty('data');
    expect(body).toHaveProperty('meta');
    expect(Array.isArray(body.data)).toBe(true);
  });

  it('meta contains pagination fields', async () => {
    const response = await GET(new Request('http://localhost/api/v1/expenses?page=1&limit=10'));
    const { meta } = await response.json();

    expect(meta).toHaveProperty('page');
    expect(meta).toHaveProperty('limit');
    expect(meta).toHaveProperty('total');
    expect(meta).toHaveProperty('totalPages');
    expect(typeof meta.page).toBe('number');
    expect(typeof meta.limit).toBe('number');
    expect(typeof meta.total).toBe('number');
    expect(typeof meta.totalPages).toBe('number');
  });

  it('expense item has required fields with correct types', async () => {
    const response = await GET(new Request('http://localhost/api/v1/expenses?page=1&limit=10'));
    const { data } = await response.json();
    const expense = data[0];

    // These fields are the CONTRACT — if any is missing, consumers break
    expect(expense).toHaveProperty('id');
    expect(expense).toHaveProperty('item');
    expect(expense).toHaveProperty('price');
    expect(expense).toHaveProperty('date');
    expect(expense).toHaveProperty('category');
    expect(expense).toHaveProperty('createdAt');

    // Type checks
    expect(typeof expense.id).toBe('string');
    expect(typeof expense.item).toBe('string');
    expect(typeof expense.price).toBe('number');
    expect(typeof expense.date).toBe('string'); // ISO string, not Date object
    expect(typeof expense.createdAt).toBe('string');

    // Category shape
    expect(expense.category).toHaveProperty('id');
    expect(expense.category).toHaveProperty('name');
  });

  it('does NOT expose internal fields', async () => {
    const response = await GET(new Request('http://localhost/api/v1/expenses?page=1&limit=10'));
    const { data } = await response.json();
    const expense = data[0];

    // These should NEVER appear in the response
    expect(expense).not.toHaveProperty('categoryId'); // redundant — category object is included
    expect(expense).not.toHaveProperty('password');
    expect(expense).not.toHaveProperty('deletedAt');
  });
});
