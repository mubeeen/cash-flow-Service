import { ExpenseService } from './expense.service';
import { withSpan } from '@/lib/tracing';
import { validate, ExpenseQuerySchema } from '@/lib/validators';
import { toExpenseDto } from '@/lib/dto';
import { apiSuccess, apiPaginated, handleError } from '@/lib/response';

export class ExpenseController {
  static async getAll(request: Request) {
    return withSpan('ExpenseController.getAll', async () => {
      try {
        const { searchParams } = new URL(request.url);
        const query = validate(ExpenseQuerySchema, Object.fromEntries(searchParams));
        const result = await ExpenseService.findAll(query.search, query.category, query.page, query.limit);
        return apiPaginated(result.expenses.map(toExpenseDto), {
          page: result.page,
          limit: query.limit,
          total: result.total,
          totalPages: result.totalPages,
        });
      } catch (error) {
        return handleError(error);
      }
    });
  }

  static async getOne(id: string) {
    return withSpan('ExpenseController.getOne', async () => {
      try {
        const expense = await ExpenseService.findById(id);
        return apiSuccess(toExpenseDto(expense));
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
        return apiSuccess(toExpenseDto(expense), 201);
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
        return apiSuccess(toExpenseDto(expense));
      } catch (error) {
        return handleError(error);
      }
    }, { expenseId: id });
  }

  static async delete(id: string) {
    return withSpan('ExpenseController.delete', async () => {
      try {
        await ExpenseService.delete(id);
        return apiSuccess({ message: 'Deleted' });
      } catch (error) {
        return handleError(error);
      }
    }, { expenseId: id });
  }
}
