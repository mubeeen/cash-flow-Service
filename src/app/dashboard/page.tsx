import { prisma } from '@/lib/db';

// ISR: cached, refreshes every 60 seconds
export const revalidate = 60;

export default async function DashboardPage() {
  const expenses = await prisma.expense.findMany({ include: { category: true } });

  // Calculate totals per category
  const categoryTotals: Record<string, number> = {};
  expenses.forEach((e) => {
    categoryTotals[e.category.name] = (categoryTotals[e.category.name] || 0) + e.price;
  });

  const grandTotal = expenses.reduce((sum, e) => sum + e.price, 0);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <p className="text-xs text-gray-400 mt-1">
          ISR: Refreshes every 60 seconds. Last rendered: {new Date().toLocaleTimeString()}
        </p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <p className="text-sm text-gray-500">Total Spending</p>
        <p className="text-4xl font-bold mt-1">€{grandTotal.toFixed(2)}</p>
        <p className="text-sm text-gray-400 mt-1">{expenses.length} expenses</p>
      </div>

      <h2 className="text-lg font-semibold mb-3">By Category</h2>
      <div className="grid grid-cols-2 gap-4">
        {Object.entries(categoryTotals).map(([name, total]) => (
          <div key={name} className="bg-white rounded-xl shadow-sm border p-4">
            <p className="text-sm text-gray-500">{name}</p>
            <p className="text-2xl font-bold mt-1">€{total.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
