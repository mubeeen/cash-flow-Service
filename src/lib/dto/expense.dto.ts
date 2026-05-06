export type ExpenseResponse = {
  id: string;
  item: string;
  price: number;
  date: string;
  category: { id: string; name: string } | null;
  createdAt: string;
};

export function toExpenseDto(expense: {
  id: string;
  item: string;
  price: number;
  date: Date;
  category?: { id: string; name: string } | null;
  createdAt: Date;
}): ExpenseResponse {
  return {
    id: expense.id,
    item: expense.item,
    price: expense.price,
    date: expense.date.toISOString(),
    category: expense.category ?? null,
    createdAt: expense.createdAt.toISOString(),
  };
}
