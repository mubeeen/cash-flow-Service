import { NextResponse } from 'next/server';
import { ExpenseService } from './expense.service';
import { withSpan } from '@/lib/tracing';
import { HttpException } from '@/lib/exceptions';
import { validate, ExpenseQuerySchema } from '@/lib/validators';

function handleError(error: unknown) {
  if (error instanceof HttpException) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export class ExpenseController {
  static async getAll(request: Request) {
    return withSpan('ExpenseController.getAll', async () => {
      try {
        const { searchParams } = new URL(request.url);
        const query = validate(ExpenseQuerySchema, Object.fromEntries(searchParams));
        const result = await ExpenseService.findAll(query.search, query.category, query.page, query.limit);
        return NextResponse.json(result);
      } catch (error) {
        return handleError(error);
      }
    });
  }

  static async getOne(id: string) {
    return withSpan('ExpenseController.getOne', async () => {
      try {
        const expense = await ExpenseService.findById(id);
        return NextResponse.json(expense);
      } catch (error) {
        return handleError(error);
      }
    }, { expenseId: id });
  }

  static async create(request: Request) {
    return withSpan('ExpenseController.create', async () => {
      try {
        const body = await request.json();
        const expense = await ExpenseService.create(body);
        return NextResponse.json(expense, { status: 201 });
      } catch (error) {
        return handleError(error);
      }
    });
  }

  static async update(id: string, request: Request) {
    return withSpan('ExpenseController.update', async () => {
      try {
        const body = await request.json();
        const expense = await ExpenseService.update(id, body);
        return NextResponse.json(expense);
      } catch (error) {
        return handleError(error);
      }
    }, { expenseId: id });
  }

  static async delete(id: string) {
    return withSpan('ExpenseController.delete', async () => {
      try {
        await ExpenseService.delete(id);
        return NextResponse.json({ message: 'Deleted' });
      } catch (error) {
        return handleError(error);
      }
    }, { expenseId: id });
  }
}
