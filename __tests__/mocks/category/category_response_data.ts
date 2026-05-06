import type { Category } from '@/lib/types';

export const categoryList: Category[] = [
  { id: 'cat-1', name: 'Food' },
  { id: 'cat-2', name: 'Transport' },
  { id: 'cat-3', name: 'Entertainment' },
  { id: 'cat-4', name: 'Bills' },
];

export const categoryNames: string[] = categoryList.map((c) => c.name);
