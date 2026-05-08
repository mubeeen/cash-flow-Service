import { CategoryController } from '@/modules/category/category.controller';

export async function GET() {
  return CategoryController.getAll();
}

export async function POST(request: Request) {
  return CategoryController.create(request);
}
