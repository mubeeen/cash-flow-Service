import type { ExpenseService } from './expense.service';
import { withSpan } from '@/lib/tracing';
import { validate, ExpenseQuerySchema } from '@/lib/validators';
import { toExpenseDto } from '@/lib/dto';
import { apiSuccess, apiPaginated, handleError } from '@/lib/response';

export class ExpenseController {
  constructor(private service: ExpenseService) {}

  async getAll(request: Request) {
    return withSpan('ExpenseController.getAll', async () => {
      try {
        const { searchParams } = new URL(request.url);
        const query = validate(ExpenseQuerySchema, Object.fromEntries(searchParams));
        const result = await this.service.findAll(query.search, query.category, query.page, query.limit);
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

  async getOne(id: string) {
    return withSpan('ExpenseController.getOne', async () => {
      try {
        const expense = await this.service.findById(id);
        return apiSuccess(toExpenseDto(expense));
      } catch (error) {
        return handleError(error);
      }
    }, { expenseId: id });
  }

  async create(request: Request) {
    return withSpan('ExpenseController.create', async () => {
      try {
        const body = await request.json();
        const expense = await this.service.create(body);
        return apiSuccess(toExpenseDto(expense), 201);
      } catch (error) {
        return handleError(error);
      }
    });
  }

  async update(id: string, request: Request) {
    return withSpan('ExpenseController.update', async () => {
      try {
        const body = await request.json();
        const expense = await this.service.update(id, body);
        return apiSuccess(toExpenseDto(expense));
      } catch (error) {
        return handleError(error);
      }
    }, { expenseId: id });
  }

  async delete(id: string) {
    return withSpan('ExpenseController.delete', async () => {
      try {
        await this.service.delete(id);
        return apiSuccess({ message: 'Deleted' });
      } catch (error) {
        return handleError(error);
      }
    }, { expenseId: id });
  }
}
