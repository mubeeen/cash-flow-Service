import type { Expense } from '@/lib/types';

export const singleExpense: Expense = {
  id: '123',
  item: 'Coffee',
  price: 5.5,
  date: new Date('2026-05-01'),
  categoryId: 'cat-1',
  createdAt: new Date('2026-05-01'),
  category: { id: 'cat-1', name: 'Food' },
};

export const expenseList: Expense[] = [
  singleExpense,
  {
    id: '456',
    item: 'Bus',
    price: 2.8,
    date: new Date('2026-05-02'),
    categoryId: 'cat-2',
    createdAt: new Date('2026-05-02'),
    category: { id: 'cat-2', name: 'Transport' },
  },
];
