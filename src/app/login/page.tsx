'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { ApiError } from '@/lib/types';

export default function LoginPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const form = new FormData(e.currentTarget);

    const res = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.get('email'),
        password: form.get('password'),
      }),
    });

    if (!res.ok) {
      const data: ApiError = await res.json();
      setError(data.error || 'Login failed');
      return;
    }

    router.push('/expenses');
    router.refresh();
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Login</h1>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type="password" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none" />
          </div>
          <button type="submit" className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          No account? <Link href="/register" className="text-black font-medium hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}
