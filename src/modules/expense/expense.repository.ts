import type { PrismaClient, Prisma } from '@prisma/client';
import { withSpan } from '@/lib/tracing';

export class ExpenseRepository {
  constructor(private db: PrismaClient) {}

  findAll(where: Prisma.ExpenseWhereInput, skip: number, take: number) {
    return withSpan('ExpenseRepository.findAll', () =>
      this.db.expense.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
        skip,
        take,
      }),
    );
  }

  count(where: object) {
    return withSpan('ExpenseRepository.count', () =>
      this.db.expense.count({ where }),
    );
  }

  findById(id: string) {
    return withSpan('ExpenseRepository.findById', () =>
      this.db.expense.findUnique({ where: { id }, include: { category: true } }),
    );
  }

  create(data: { item: string; price: number; date: string; categoryId: string }) {
    return withSpan('ExpenseRepository.create', () =>
      this.db.expense.create({ data }),
    );
  }

  update(id: string, data: Prisma.ExpenseUpdateInput) {
    return withSpan('ExpenseRepository.update', () =>
      this.db.expense.update({ where: { id }, data }),
    );
  }

  delete(id: string) {
    return withSpan('ExpenseRepository.delete', () =>
      this.db.expense.delete({ where: { id } }),
    );
  }
}
