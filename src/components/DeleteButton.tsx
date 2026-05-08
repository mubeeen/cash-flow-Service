'use client';

import { useRouter } from 'next/navigation';

export function DeleteButton({ id }: { id: string }) {
  const router = useRouter();

  async function handleDelete() {
    if (!confirm('Delete this expense?')) return;

    await fetch(`/api/v1/expenses/${id}`, { method: 'DELETE' });
    router.push('/expenses');
    router.refresh();
  }

  return (
    <button onClick={handleDelete} title="Delete" className="p-1.5 rounded hover:bg-red-50 text-red-500 hover:text-red-700 transition-colors">
      🗑️
    </button>
  );
}
