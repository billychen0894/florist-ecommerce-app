import { cn } from '@/lib/classNames';

export default function ProductListSkeleton({
  length,
  className,
}: {
  length: number;
  className?: string;
}) {
  return (
    <div
      className={cn(
        'mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4',
        className
      )}
    >
      {Array.from({ length }).map((_, i) => (
        <div key={i}>
          <div className="aspect-h-4 aspect-w-3 bg-slate-300 animate-pulse rounded" />
          <div className="mt-4 flex items-center justify-between space-x-8">
            <h3 className="shrink">
              <div className="w-20 h-6 bg-slate-300 animate-pulse rounded" />
            </h3>
            <div className="w-12 h-6 bg-slate-200 animate-pulse rounded flex-shrink-0" />
          </div>
          <div className="mt-1 w-12 h-6 bg-slate-200 animate-pulse rounded shrink" />
        </div>
      ))}
    </div>
  );
}
