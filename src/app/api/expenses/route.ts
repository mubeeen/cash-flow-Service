import { expenseController } from '@/modules/expense';

export async function GET(request: Request) {
  return expenseController.getAll(request);
}

export async function POST(request: Request) {
  return expenseController.create(request);
}
