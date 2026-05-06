export default function Loading() {
  return (
    <div className="animate-pulse">
      <div className="h-8 bg-gray-200 rounded w-40 mb-6"></div>
      <div className="bg-white rounded-xl shadow-sm border overflow-hidden">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="flex gap-4 p-4 border-b last:border-0">
            <div className="h-4 bg-gray-200 rounded w-32"></div>
            <div className="h-4 bg-gray-200 rounded w-20"></div>
            <div className="h-4 bg-gray-200 rounded w-16"></div>
            <div className="h-4 bg-gray-200 rounded w-24"></div>
          </div>
        ))}
      </div>
    </div>
  );
}
