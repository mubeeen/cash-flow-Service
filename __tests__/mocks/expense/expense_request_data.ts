import type { CreateExpenseInput, UpdateExpenseInput } from '@/lib/types';

export const validCreateExpenseInput: CreateExpenseInput = {
  item: 'Coffee',
  price: 5.5,
  date: '2026-05-03',
  categoryId: 'cat-1',
};

export const invalidCreateExpenseInput = {
  item: 'Coffee',
  // missing price, date, categoryId
};

export const validUpdateExpenseInput: UpdateExpenseInput = {
  item: 'Latte',
  price: 6.0,
};
