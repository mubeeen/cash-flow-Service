export const SpanAttributes = {
  // Expense
  EXPENSE_ID: 'app.expense.id',
  EXPENSE_ITEM: 'app.expense.item',
  EXPENSE_PRICE: 'app.expense.price',
  EXPENSE_CATEGORY: 'app.expense.category',

  // Category
  CATEGORY_ID: 'app.category.id',
  CATEGORY_NAME: 'app.category.name',

  // Auth
  USER_EMAIL: 'app.user.email',
  USER_ID: 'app.user.id',

  // Search & Pagination
  SEARCH_QUERY: 'app.search.query',
  SEARCH_CATEGORY: 'app.search.category',
  PAGE_NUMBER: 'app.pagination.page',
  PAGE_LIMIT: 'app.pagination.limit',
  RESULT_COUNT: 'app.result.count',
  RESULT_TOTAL: 'app.result.total',
} as const;
