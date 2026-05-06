import Link from 'next/link';

export default function HomePage() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-3">💰 Expense Tracker</h1>
      <p className="text-gray-500 mb-8">Track your spending. Stay on budget.</p>
      <div className="flex gap-4 justify-center">
        <Link href="/expenses" className="bg-black text-white px-6 py-2 rounded-lg text-sm hover:bg-gray-800">
          View Expenses
        </Link>
        <Link href="/expenses/new" className="border border-gray-300 px-6 py-2 rounded-lg text-sm hover:bg-gray-100">
          Add Expense
        </Link>
      </div>
    </div>
  );
}
