import { expenseController } from '@/modules/expense';

type Params = { params: { id: string } };

export async function GET(_req: Request, { params }: Params) {
  return expenseController.getOne(params.id);
}

export async function PATCH(request: Request, { params }: Params) {
  return expenseController.update(params.id, request);
}

export async function DELETE(_req: Request, { params }: Params) {
  return expenseController.delete(params.id);
}
