import { prisma } from '@/lib/db';
import { ExpenseRepository } from './expense.repository';
import { ExpenseService } from './expense.service';
import { ExpenseController } from './expense.controller';

const expenseRepository = new ExpenseRepository(prisma);
const expenseService = new ExpenseService(expenseRepository);
export const expenseController = new ExpenseController(expenseService);
