export default function Loading() {
  return (
    <div className="max-w-lg animate-pulse">
      <div className="h-4 bg-gray-200 rounded w-32 mb-4"></div>
      <div className="bg-white rounded-xl shadow-sm border p-6">
        <div className="h-8 bg-gray-200 rounded w-48 mb-4"></div>
        <div className="h-4 bg-gray-200 rounded w-24 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-32 mb-2"></div>
        <div className="h-4 bg-gray-200 rounded w-28"></div>
      </div>
    </div>
  );
}
