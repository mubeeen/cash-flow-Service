/**
 * @jest-environment node
 */
import type { Expense } from '@/lib/types';
import { validCreateExpenseInput, validUpdateExpenseInput } from '../mocks/expense/expense_request_data';

jest.mock('@/lib/db', () => {
  const expenses: any[] = [];
  let idCounter = 1;

  return {
    prisma: {
      expense: {
        findMany: jest.fn(() => Promise.resolve([...expenses])),
        findUnique: jest.fn(({ where }) => Promise.resolve(expenses.find((e) => e.id === where.id) || null)),
        create: jest.fn(({ data }) => {
          const expense = { id: String(idCounter++), ...data, createdAt: new Date(), category: { id: data.categoryId, name: 'Food' } };
          expenses.push(expense);
          return Promise.resolve(expense);
        }),
        update: jest.fn(({ where, data }) => {
          const i = expenses.findIndex((e) => e.id === where.id);
          if (i === -1) return Promise.resolve(null);
          expenses[i] = { ...expenses[i], ...data };
          return Promise.resolve(expenses[i]);
        }),
        delete: jest.fn(({ where }) => {
          const i = expenses.findIndex((e) => e.id === where.id);
          if (i === -1) return Promise.resolve(null);
          return Promise.resolve(expenses.splice(i, 1)[0]);
        }),
        count: jest.fn(() => Promise.resolve(expenses.length)),
      },
    },
  };
});

import { GET, POST } from '@/app/api/expenses/route';
import { GET as GET_ONE, PATCH, DELETE } from '@/app/api/expenses/[id]/route';

describe('Expense CRUD Integration', () => {
  it('full lifecycle: create → read → update → delete', async () => {
    // CREATE
    const createRes = await POST(new Request('http://localhost/api/expenses', {
      method: 'POST', body: JSON.stringify(validCreateExpenseInput),
    }));
    const created: Expense = await createRes.json();
    expect(createRes.status).toBe(201);
    expect(created.item).toBe('Coffee');

    // READ ALL
    const listRes = await GET(new Request('http://localhost/api/expenses?page=1&limit=10'));
    const listData: { expenses: Expense[] } = await listRes.json();
    expect(listData.expenses).toHaveLength(1);

    // READ ONE
    const getRes = await GET_ONE(new Request(`http://localhost/api/expenses/${created.id}`), { params: { id: created.id } });
    const fetched: Expense = await getRes.json();
    expect(fetched.item).toBe('Coffee');

    // UPDATE
    const updateRes = await PATCH(new Request(`http://localhost/api/expenses/${created.id}`, {
      method: 'PATCH', body: JSON.stringify(validUpdateExpenseInput),
    }), { params: { id: created.id } });
    const updated: Expense = await updateRes.json();
    expect(updated.item).toBe('Latte');

    // DELETE
    const deleteRes = await DELETE(new Request(`http://localhost/api/expenses/${created.id}`), { params: { id: created.id } });
    expect(deleteRes.status).toBe(200);

    // VERIFY DELETED
    const finalRes = await GET(new Request('http://localhost/api/expenses?page=1&limit=10'));
    const finalData: { expenses: Expense[] } = await finalRes.json();
    expect(finalData.expenses).toHaveLength(0);
  });
});
