/**
 * @jest-environment node
 */
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
          const expense = {
            id: String(idCounter++),
            ...data,
            date: new Date(data.date),
            createdAt: new Date(),
            category: { id: data.categoryId, name: 'Food' },
          };
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

import { GET, POST } from '@/app/api/v1/expenses/route';
import { GET as GET_ONE, PATCH, DELETE } from '@/app/api/v1/expenses/[id]/route';

describe('Expense CRUD Integration', () => {
  it('full lifecycle: create → read → update → delete', async () => {
    // CREATE
    const createRes = await POST(new Request('http://localhost/api/expenses', {
      method: 'POST', body: JSON.stringify(validCreateExpenseInput),
    }));
    const createBody = await createRes.json();
    expect(createRes.status).toBe(201);
    expect(createBody.data.item).toBe('Coffee');

    const id = createBody.data.id;

    // READ ALL
    const listRes = await GET(new Request('http://localhost/api/expenses?page=1&limit=10'));
    const listBody = await listRes.json();
    expect(listBody.data).toHaveLength(1);

    // READ ONE
    const getRes = await GET_ONE(new Request(`http://localhost/api/expenses/${id}`), { params: { id } });
    const getBody = await getRes.json();
    expect(getBody.data.item).toBe('Coffee');

    // UPDATE
    const updateRes = await PATCH(new Request(`http://localhost/api/expenses/${id}`, {
      method: 'PATCH', body: JSON.stringify(validUpdateExpenseInput),
    }), { params: { id } });
    const updateBody = await updateRes.json();
    expect(updateBody.data.item).toBe('Latte');

    // DELETE
    const deleteRes = await DELETE(new Request(`http://localhost/api/expenses/${id}`), { params: { id } });
    expect(deleteRes.status).toBe(200);

    // VERIFY DELETED
    const finalRes = await GET(new Request('http://localhost/api/expenses?page=1&limit=10'));
    const finalBody = await finalRes.json();
    expect(finalBody.data).toHaveLength(0);
  });
});
