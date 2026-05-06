import { prisma } from '@/lib/db';
import { withSpan } from '@/lib/tracing';

export class ExpenseRepository {
  static findAll(where: object, skip: number, take: number) {
    return withSpan('ExpenseRepository.findAll', () =>
      prisma.expense.findMany({
        where,
        include: { category: true },
        orderBy: { date: 'desc' },
        skip,
        take,
      }),
    );
  }

  static count(where: object) {
    return withSpan('ExpenseRepository.count', () =>
      prisma.expense.count({ where }),
    );
  }

  static findById(id: string) {
    return withSpan('ExpenseRepository.findById', () =>
      prisma.expense.findUnique({ where: { id }, include: { category: true } }),
      { expenseId: id },
    );
  }

  static create(data: { item: string; price: number; date: string; categoryId: string }) {
    return withSpan('ExpenseRepository.create', () =>
      prisma.expense.create({ data }),
    );
  }

  static update(id: string, data: object) {
    return withSpan('ExpenseRepository.update', () =>
      prisma.expense.update({ where: { id }, data }),
      { expenseId: id },
    );
  }

  static delete(id: string) {
    return withSpan('ExpenseRepository.delete', () =>
      prisma.expense.delete({ where: { id } }),
      { expenseId: id },
    );
  }
}
