import { prisma } from '@/lib/db';
import { withSpan } from '@/lib/tracing';

export class CategoryRepository {
  static findAll() {
    return withSpan('CategoryRepository.findAll', () =>
      prisma.category.findMany(),
    );
  }

  static create(name: string) {
    return withSpan('CategoryRepository.create', () =>
      prisma.category.create({ data: { name } }),
      { categoryName: name },
    );
  }
}
