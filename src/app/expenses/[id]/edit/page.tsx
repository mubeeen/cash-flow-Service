'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { Expense, Category, UpdateExpenseInput } from '@/lib/types';

export default function EditExpensePage({ params }: { params: { id: string } }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [item, setItem] = useState('');
  const [price, setPrice] = useState('');
  const [date, setDate] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);

  useEffect(() => {
    Promise.all([
      fetch(`/api/v1/expenses/${params.id}`).then((r) => r.json()),
      fetch('/api/v1/categories').then((r) => r.json()),
    ]).then(([expense, cats]: [Expense, Category[]]) => {
      setItem(expense.item);
      setPrice(String(expense.price));
      setDate(String(expense.date).split('T')[0] ?? '');
      setCategoryId(expense.categoryId);
      setCategories(cats);
      setLoading(false);
    });
  }, [params.id]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const body: UpdateExpenseInput = {
      item,
      price: parseFloat(price),
      date: new Date(date).toISOString(),
      categoryId,
    };

    await fetch(`/api/v1/expenses/${params.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });

    router.push('/expenses');
    router.refresh();
  }

  if (loading) return <p className="text-gray-400">Loading...</p>;

  return (
    <div className="max-w-md">
      <Link href="/expenses" className="text-gray-500 text-sm hover:text-black mb-4 inline-block">← Back to expenses</Link>

      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Expense</h1>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Item</label>
            <input value={item} onChange={(e) => setItem(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Price (€)</label>
            <input type="number" step="0.01" value={price} onChange={(e) => setPrice(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
            <input type="date" value={date} onChange={(e) => setDate(e.target.value)} required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select value={categoryId} onChange={(e) => setCategoryId(e.target.value)} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none">
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
          <button type="submit" className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Save Changes
          </button>
        </form>
      </div>
    </div>
  );
}
