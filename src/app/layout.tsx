import './globals.css';
import Link from 'next/link';
import { cookies } from 'next/headers';
import { LogoutButton } from '@/components/LogoutButton';

export const metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const session = cookies().get('session');

  return (
    <html lang="en">
      <body className="bg-gray-50 min-h-screen">
        <nav className="bg-white border-b shadow-sm">
          <div className="max-w-4xl mx-auto px-6 py-3 flex items-center justify-between">
            <div className="flex items-center gap-6">
              <Link href="/" className="font-bold text-lg">💰 ExpenseTracker</Link>
              {session && (
                <>
                  <Link href="/expenses" className="text-gray-600 hover:text-black text-sm">Expenses</Link>
                  <Link href="/expenses/new" className="text-gray-600 hover:text-black text-sm">Add New</Link>
                  <Link href="/dashboard" className="text-gray-600 hover:text-black text-sm">Dashboard</Link>
                  <Link href="/about-us" className="text-gray-600 hover:text-black text-sm">About</Link>
                </>
              )}
            </div>
            <div>
              {session ? (
                <LogoutButton />
              ) : (
                <Link href="/login" className="text-sm text-gray-600 hover:text-black">Login</Link>
              )}
            </div>
          </div>
        </nav>
        <main className="max-w-4xl mx-auto px-6 py-8">{children}</main>
      </body>
    </html>
  );
}
