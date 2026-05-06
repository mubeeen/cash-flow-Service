import Link from 'next/link';
import { notFound } from 'next/navigation';
import { prisma } from '@/lib/db';
import { DeleteButton } from '@/components/DeleteButton';

export default async function ExpenseDetailPage({ params }: { params: { id: string } }) {
  const expense = await prisma.expense.findUnique({
    where: { id: params.id },
    include: { category: true },
  });

  if (!expense) notFound();

  return (
    <div className="max-w-lg">
      <Link href="/expenses" className="text-gray-500 text-sm hover:text-black mb-4 inline-block">← Back to expenses</Link>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold">{expense.item}</h1>
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium mt-2 inline-block">
              {expense.category.name}
            </span>
          </div>
          <p className="text-3xl font-bold">€{expense.price.toFixed(2)}</p>
        </div>

        <div className="border-t pt-4 text-sm text-gray-500 space-y-2">
          <p>Date: {new Date(expense.date).toLocaleDateString()}</p>
          <p>Added: {new Date(expense.createdAt).toLocaleString()}</p>
        </div>

        <div className="flex gap-3 mt-6 pt-4 border-t">
          <Link href={`/expenses/${expense.id}/edit`} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
            ✏️ Edit
          </Link>
          <DeleteButton id={expense.id} />
        </div>
      </div>
    </div>
  );
}
