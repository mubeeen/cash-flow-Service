'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DeleteButton } from './DeleteButton';

type Expense = {
  id: string;
  item: string;
  price: number;
  date: string | Date;
  category: { id: string; name: string };
};

export function ExpenseTable({ initialExpenses, categories }: { initialExpenses: Expense[]; categories: string[] }) {
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    const params = new URLSearchParams();
    if (search) params.set('search', search);
    if (categoryFilter) params.set('category', categoryFilter);
    params.set('page', String(page));
    params.set('limit', '5');

    fetch(`/api/expenses?${params}`)
      .then((r) => r.json())
      .then((data) => {
        setExpenses(data.expenses);
        setTotal(data.total);
        setTotalPages(data.totalPages);
      });
  }, [search, categoryFilter, page]);

  return (
    <div>
      <div className="flex gap-3 mb-4">
        <input
          placeholder="Search expenses..."
          value={search}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
          className="flex-1 border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
        />
        <select
          value={categoryFilter}
          onChange={(e) => { setCategoryFilter(e.target.value); setPage(1); }}
          className="border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>{c}</option>
          ))}
        </select>
      </div>

      <p className="text-sm text-gray-500 mb-4">
        Showing {expenses.length} of {total} expenses
      </p>

      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-gray-50 border-b text-gray-500 text-xs uppercase tracking-wider">
              <th className="text-left p-4">Item</th>
              <th className="text-left p-4">Category</th>
              <th className="text-right p-4">Price</th>
              <th className="text-left p-4">Date</th>
              <th className="text-center p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((e) => (
              <tr key={e.id} className="border-b last:border-0 hover:bg-gray-50 transition-colors">
                <td className="p-4 font-medium">{e.item}</td>
                <td className="p-4">
                  <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-full text-xs font-medium">
                    {e.category.name}
                  </span>
                </td>
                <td className="p-4 text-right font-mono">€{e.price.toFixed(2)}</td>
                <td className="p-4 text-gray-500">{new Date(e.date).toLocaleDateString()}</td>
                <td className="p-4">
                  <div className="flex justify-center gap-2">
                    <Link href={`/expenses/${e.id}`} className="p-1.5 rounded hover:bg-gray-100" title="View">👁️</Link>
                    <Link href={`/expenses/${e.id}/edit`} className="p-1.5 rounded hover:bg-gray-100" title="Edit">✏️</Link>
                    <DeleteButton id={e.id} />
                  </div>
                </td>
              </tr>
            ))}
            {expenses.length === 0 && (
              <tr>
                <td colSpan={5} className="p-8 text-center text-gray-400">
                  {search || categoryFilter ? 'No expenses match your filters' : 'No expenses yet. Add one!'}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between items-center mt-4">
          <button
            onClick={() => setPage((p) => p - 1)}
            disabled={page <= 1}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>
          <span className="text-sm text-gray-500">Page {page} of {totalPages}</span>
          <button
            onClick={() => setPage((p) => p + 1)}
            disabled={page >= totalPages}
            className="px-4 py-2 text-sm border rounded-lg hover:bg-gray-100 disabled:opacity-30 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
