import { ExpenseController } from '@/modules/expense/expense.controller';

export async function GET(request: Request) {
  return ExpenseController.getAll(request);
}

export async function POST(request: Request) {
  return ExpenseController.create(request);
}
