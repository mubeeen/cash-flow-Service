import { z } from 'zod';

export const CreateCategorySchema = z.object({
  name: z.string().min(1, 'Name is required').max(100),
});
