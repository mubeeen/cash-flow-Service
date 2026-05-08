'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Category, CreateExpenseInput, ApiError } from '@/lib/types';

export default function NewExpensePage() {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/v1/categories').then((r) => r.json()).then(setCategories);
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const form = new FormData(e.currentTarget);
    const body: CreateExpenseInput = {
      item: form.get('item') as string,
      price: parseFloat(form.get('price') as string),
      date: new Date(form.get('date') as string).toISOString(),
      categoryId: form.get('categoryId') as string,
    };

    const res = await fetch('/api/v1/expenses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    if (!res.ok) {
      const data: ApiError = await res.json();
      setError(data.error || 'Something went wrong');
      return;
    }

    router.push('/expenses');
    router.refresh();
  }

  return (
    <div className="max-w-md">
      <Link href="/expenses" className="text-gray-500 text-sm hover:text-black mb-4 inline-block">← Back to expenses</Link>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6">Add New Expense</h1>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
            <input name="item" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none" placeholder="Coffee" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
            <input name="price" type="number" step="0.01" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none" placeholder="5.50" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input name="date" type="date" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select name="categoryId" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none">
              <option value="">Select category</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Add Expense
          </button>
        </form>
      </div>
    </div>
  );
}
