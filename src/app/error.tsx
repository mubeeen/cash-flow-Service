'use client';

export default function Error({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <div className="text-center py-20">
      <h1 className="text-2xl font-bold text-red-600 mb-2">Something went wrong</h1>
      <p className="text-gray-500 text-sm mb-6">{error.message}</p>
      <button onClick={reset} className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
        Try again
      </button>
    </div>
  );
}
