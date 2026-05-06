'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function RegisterPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');

    const form = new FormData(e.currentTarget);

    const res = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: form.get('name'),
        email: form.get('email'),
        password: form.get('password'),
      }),
    });

    if (!res.ok) {
      const text = await res.text();
      const data = text ? JSON.parse(text) : {};
      setError(data.error || 'Registration failed');
      return;
    }

    router.push('/login');
  }

  return (
    <div className="max-w-sm mx-auto mt-20">
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <h1 className="text-2xl font-bold mb-6 text-center">Register</h1>

        {error && <div className="bg-red-50 text-red-600 p-3 rounded-lg mb-4 text-sm">{error}</div>}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input name="name" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none" placeholder="Muhammad" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input name="email" type="email" required className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none" placeholder="you@example.com" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input name="password" type="password" required minLength={6} className="w-full border border-gray-300 rounded-lg p-2.5 text-sm focus:ring-2 focus:ring-black focus:border-black outline-none" />
          </div>
          <button type="submit" className="w-full bg-black text-white py-2.5 rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors">
            Create Account
          </button>
        </form>

        <p className="text-center text-sm text-gray-500 mt-4">
          Already have an account? <Link href="/login" className="text-black font-medium hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}
