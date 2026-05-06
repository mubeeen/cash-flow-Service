import { NextResponse } from 'next/server';
import { CategoryService } from './category.service';
import { withSpan } from '@/lib/tracing';
import { HttpException } from '@/lib/exceptions';
import { toCategoryDto } from '@/lib/dto';

function handleError(error: unknown) {
  if (error instanceof HttpException) {
    return NextResponse.json({ error: error.message }, { status: error.statusCode });
  }
  return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
}

export class CategoryController {
  static async getAll() {
    return withSpan('CategoryController.getAll', async () => {
      const categories = await CategoryService.findAll();
      return NextResponse.json(categories.map(toCategoryDto));
    });
  }

  static async create(request: Request) {
    return withSpan('CategoryController.create', async () => {
      try {
        const body = await request.json();
        const category = await CategoryService.create(body);
        return NextResponse.json(toCategoryDto(category), { status: 201 });
      } catch (error) {
        return handleError(error);
      }
    });
  }
}
