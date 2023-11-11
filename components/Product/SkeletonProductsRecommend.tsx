export default function SkeletonProductsRecommend() {
  return (
    <div className="mt-10 border-t border-gray-200 px-4 py-16 sm:px-0">
      <h2 id="related-heading" className="text-xl font-bold text-gray-900">
        You may also like
      </h2>
      <div className="mt-8 grid grid-cols-1 gap-y-12 sm:grid-cols-2 sm:gap-x-6 lg:grid-cols-4 xl:gap-x-8">
        {Array.from({ length: 4 }).map((_, i) => (
          <div
            key={i}
            className="aspect-h-1 aspect-w-1 w-full rounded-md lg:aspect-none lg:h-80 bg-slate-200 animate-pulse"
          />
        ))}
      </div>
    </div>
  );
}
