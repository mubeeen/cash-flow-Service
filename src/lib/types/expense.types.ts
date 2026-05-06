import { Category } from './category.types';

// Server-side: Prisma returns Date objects
// Client-side: JSON serializes them to strings
// Using string | Date covers both cases
export type Expense = {
  id: string;
  item: string;
  price: number;
  date: string | Date;
  categoryId: string;
  category?: Category;
  createdAt: string | Date;
};

export type CreateExpenseInput = {
  item: string;
  price: number;
  date: string;
  categoryId: string;
};

export type UpdateExpenseInput = Partial<CreateExpenseInput>;
