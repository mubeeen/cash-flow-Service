import { z } from 'zod';

export const CreateExpenseSchema = z.object({
  item: z.string().min(1, 'Item is required').max(255),
  price: z.number().positive('Price must be greater than 0'),
  date: z.string().datetime('Must be a valid ISO date'),
  categoryId: z.string().uuid('Must be a valid category ID'),
});

export const UpdateExpenseSchema = CreateExpenseSchema.partial();

export const ExpenseQuerySchema = z.object({
  search: z.string().default(''),
  category: z.string().default(''),
  page: z.coerce.number().int().positive().default(1),
  limit: z.coerce.number().int().min(1).max(100).default(5),
});
