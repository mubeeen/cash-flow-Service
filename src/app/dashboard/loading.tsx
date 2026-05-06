export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-40 mb-6"></div>
      <div className="bg-white rounded-xl shadow-sm border p-6 mb-6">
        <div className="h-4 bg-gray-200 rounded w-28 mb-2"></div>
        <div className="h-10 bg-gray-200 rounded w-36"></div>
      </div>
      <div className="h-6 bg-gray-200 rounded w-32 mb-3"></div>
      <div className="grid grid-cols-2 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-xl shadow-sm border p-4">
            <div className="h-4 bg-gray-200 rounded w-20 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
