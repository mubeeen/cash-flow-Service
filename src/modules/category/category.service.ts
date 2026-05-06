import { CategoryRepository } from './category.repository';
import { withSpan } from '@/lib/tracing';
import { validate, CreateCategorySchema } from '@/lib/validators';

export class CategoryService {
  static findAll() {
    return withSpan('CategoryService.findAll', () =>
      CategoryRepository.findAll(),
    );
  }

  static create(data: unknown) {
    return withSpan('CategoryService.create', async () => {
      const { name } = validate(CreateCategorySchema, data);
      return CategoryRepository.create(name);
    });
  }
}
