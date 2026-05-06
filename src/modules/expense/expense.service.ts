import { ExpenseRepository } from './expense.repository';
import { withSpan, SpanAttributes } from '@/lib/tracing';
import { NotFoundException } from '@/lib/exceptions';
import { validate, CreateExpenseSchema, UpdateExpenseSchema } from '@/lib/validators';

export class ExpenseService {
  static async findAll(search: string, category: string, page: number, limit: number) {
    return withSpan('ExpenseService.findAll', async () => {
      const where = {
        item: { contains: search, mode: 'insensitive' as const },
        ...(category && { category: { name: category } }),
      };

      const [expenses, total] = await Promise.all([
        ExpenseRepository.findAll(where, (page - 1) * limit, limit),
        ExpenseRepository.count(where),
      ]);

      return { expenses, total, page, totalPages: Math.ceil(total / limit) };
    }, {
      [SpanAttributes.SEARCH_QUERY]: search,
      [SpanAttributes.SEARCH_CATEGORY]: category,
      [SpanAttributes.PAGE_NUMBER]: page,
      [SpanAttributes.PAGE_LIMIT]: limit,
    });
  }

  static async findById(id: string) {
    return withSpan('ExpenseService.findById', async () => {
      const expense = await ExpenseRepository.findById(id);
      if (!expense) throw new NotFoundException(`Expense ${id} not found`);
      return expense;
    }, { [SpanAttributes.EXPENSE_ID]: id });
  }

  static async create(data: unknown) {
    return withSpan('ExpenseService.create', async () => {
      const validated = validate(CreateExpenseSchema, data);
      return ExpenseRepository.create(validated);
    });
  }

  static async update(id: string, data: unknown) {
    return withSpan('ExpenseService.update', async () => {
      const validated = validate(UpdateExpenseSchema, data);
      await this.findById(id);
      return ExpenseRepository.update(id, validated);
    }, { [SpanAttributes.EXPENSE_ID]: id });
  }

  static async delete(id: string) {
    return withSpan('ExpenseService.delete', async () => {
      await this.findById(id);
      return ExpenseRepository.delete(id);
    }, { [SpanAttributes.EXPENSE_ID]: id });
  }
}
