import type { CreateExpenseInput, UpdateExpenseInput } from '@/lib/types';

export const validCreateExpenseInput: CreateExpenseInput = {
  item: 'Coffee',
  price: 5.5,
  date: '2026-05-03T00:00:00.000Z',
  categoryId: '00000000-0000-0000-0000-000000000001',
};

export const invalidCreateExpenseInput = {
  item: 'Coffee',
  // missing price, date, categoryId
};

export const validUpdateExpenseInput: UpdateExpenseInput = {
  item: 'Latte',
  price: 6.0,
};
