import { CategoryService } from './category.service';
import { withSpan } from '@/lib/tracing';
import { HttpException } from '@/lib/exceptions';
import { toCategoryDto } from '@/lib/dto';
import { apiSuccess, apiError } from '@/lib/response';

function handleError(error: unknown) {
  if (error instanceof HttpException) {
    return apiError(error.message, error.statusCode);
  }
  return apiError('Internal server error', 500);
}

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
