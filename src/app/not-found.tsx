import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="text-center py-20">
      <h1 className="text-4xl font-bold mb-2">404</h1>
      <p className="text-gray-500 mb-6">Page not found</p>
      <Link href="/" className="bg-black text-white px-4 py-2 rounded-lg text-sm hover:bg-gray-800">
        Go home
      </Link>
    </div>
  );
}
