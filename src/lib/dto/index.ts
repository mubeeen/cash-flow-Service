// --- Expense DTOs ---

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

// --- Category DTOs ---

export type CategoryResponse = {
  id: string;
  name: string;
};

export function toCategoryDto(category: { id: string; name: string }): CategoryResponse {
  return { id: category.id, name: category.name };
}

// --- User DTOs ---
// NEVER expose password — this is why DTOs exist

export type UserResponse = {
  id: string;
  name: string;
  email: string;
  createdAt: string;
};

export function toUserDto(user: {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}): UserResponse {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    createdAt: user.createdAt.toISOString(),
  };
}
