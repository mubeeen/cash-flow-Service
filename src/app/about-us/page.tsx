export const dynamic = 'force-static';

export default function AboutUsPage() {
  return (
    <div className="max-w-2xl">
      <h1 className="text-2xl font-bold mb-6">About Us</h1>

      <div className="bg-white rounded-xl shadow-sm border p-6 space-y-6">
        <div>
          <h2 className="text-lg font-semibold mb-2">What is Expense Tracker?</h2>
          <p className="text-gray-600 text-sm leading-relaxed">
            Expense Tracker is a simple, fast tool to help you manage your daily spending.
            Add expenses, organize them by category, and see where your money goes.
          </p>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Features</h2>
          <ul className="text-gray-600 text-sm space-y-2">
            <li>✅ Add, edit, and delete expenses</li>
            <li>✅ Organize by categories (Food, Transport, Bills, etc.)</li>
            <li>✅ View spending totals at a glance</li>
            <li>✅ Dashboard with category breakdowns</li>
            <li>✅ Fast and responsive design</li>
          </ul>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Tech Stack</h2>
          <div className="flex flex-wrap gap-2">
            {['Next.js 14', 'TypeScript', 'Prisma', 'PostgreSQL', 'Tailwind CSS'].map((tech) => (
              <span key={tech} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-xs font-medium">
                {tech}
              </span>
            ))}
          </div>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-2">Built By</h2>
          <p className="text-gray-600 text-sm">
            Muhammad Mubeen — Full Stack Engineer based in Helsinki, Finland.
          </p>
        </div>
      </div>

      <p className="text-xs text-gray-400 mt-6">
        This page is statically generated (SSG). Built at: {new Date().toLocaleString()}
      </p>
    </div>
  );
}
