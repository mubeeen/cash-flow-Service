import type { ExpenseRepository } from './expense.repository';
import { withSpan, SpanAttributes } from '@/lib/tracing';
import { NotFoundException } from '@/lib/exceptions';
import { validate, CreateExpenseSchema, UpdateExpenseSchema } from '@/lib/validators';

export class ExpenseService {
  constructor(private repo: ExpenseRepository) {}

  async findAll(search: string, category: string, page: number, limit: number) {
    return withSpan('ExpenseService.findAll', async () => {
      const where = {
        item: { contains: search, mode: 'insensitive' as const },
        ...(category && { category: { name: category } }),
      };

      const [expenses, total] = await Promise.all([
        this.repo.findAll(where, (page - 1) * limit, limit),
        this.repo.count(where),
      ]);

      return { expenses, total, page, totalPages: Math.ceil(total / limit) };
    }, {
      [SpanAttributes.SEARCH_QUERY]: search,
      [SpanAttributes.SEARCH_CATEGORY]: category,
      [SpanAttributes.PAGE_NUMBER]: page,
      [SpanAttributes.PAGE_LIMIT]: limit,
    });
  }

  async findById(id: string) {
    return withSpan('ExpenseService.findById', async () => {
      const expense = await this.repo.findById(id);
      if (!expense) throw new NotFoundException(`Expense ${id} not found`);
      return expense;
    }, { [SpanAttributes.EXPENSE_ID]: id });
  }

  async create(data: unknown) {
    return withSpan('ExpenseService.create', async () => {
      const validated = validate(CreateExpenseSchema, data);
      return this.repo.create(validated);
    });
  }

  async update(id: string, data: unknown) {
    return withSpan('ExpenseService.update', async () => {
      const validated = validate(UpdateExpenseSchema, data);
      await this.findById(id);
      return this.repo.update(id, validated);
    }, { [SpanAttributes.EXPENSE_ID]: id });
  }

  async delete(id: string) {
    return withSpan('ExpenseService.delete', async () => {
      await this.findById(id);
      return this.repo.delete(id);
    }, { [SpanAttributes.EXPENSE_ID]: id });
  }
}
