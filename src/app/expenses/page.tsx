import Link from 'next/link';
import { prisma } from '@/lib/db';
import { ExpenseTable } from '@/components/ExpenseTable';

export const dynamic = 'force-dynamic';

export default async function ExpensesPage() {
  const expenses = await prisma.expense.findMany({
    include: { category: true },
    orderBy: { date: 'desc' },
  });

  const categories = await prisma.category.findMany();
  const categoryNames = categories.map((c) => c.name);

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Expenses</h1>
        <Link href="/expenses/new" className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
          + Add Expense
        </Link>
      </div>

      <ExpenseTable initialExpenses={expenses} categories={categoryNames} />
    </div>
  );
}
