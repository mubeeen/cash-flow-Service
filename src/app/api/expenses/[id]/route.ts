import { ExpenseController } from '@/modules/expense/expense.controller';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  return ExpenseController.getOne(params.id);
}

export async function PATCH(request: Request, { params }: Params) {
  return ExpenseController.update(params.id, request);
}

export async function DELETE(_req: Request, { params }: Params) {
  return ExpenseController.delete(params.id);
}
