import { NextResponse } from 'next/server';

type PaginationMeta = {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
};

export function apiSuccess<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

export function apiPaginated<T>(data: T[], meta: PaginationMeta) {
  return NextResponse.json({ data, meta });
}

export function apiError(message: string, statusCode: number) {
  return NextResponse.json({ error: { message, statusCode } }, { status: statusCode });
}

export { handleError } from './handle-error';
