import { CategoryService } from './category.service';
import { withSpan } from '@/lib/tracing';
import { toCategoryDto } from '@/lib/dto';
import { apiSuccess, handleError } from '@/lib/response';

export class CategoryController {
  static async getAll() {
    return withSpan('CategoryController.getAll', async () => {
      const categories = await CategoryService.findAll();
      return apiSuccess(categories.map(toCategoryDto));
    });
  }

  static async create(request: Request) {
    return withSpan('CategoryController.create', async () => {
      try {
        const body = await request.json();
        const category = await CategoryService.create(body);
        return apiSuccess(toCategoryDto(category), 201);
      } catch (error) {
        return handleError(error);
      }
    });
  }
}
