import { Skeleton } from '@components/ui/Skeleton';

export default function PaginationSkeleton() {
  return (
    <div className="w-full mt-8 mb-16 flex max-w-7xl justify-between">
      <Skeleton className="w-[6rem] h-10 bg-slate-300 rounded" />
      <div className="space-x-2">
        <Skeleton className="inline-flex h-10 w-[2.5rem] items-center rounded px-4 bg-slate-300"></Skeleton>
        <Skeleton className="inline-flex h-10 w-[2.5rem] items-center rounded px-4 bg-slate-300"></Skeleton>
        <Skeleton className="inline-flex h-10 w-[2.5rem] items-center rounded px-4 bg-slate-300"></Skeleton>
        <Skeleton className="inline-flex h-10 w-[2.5rem] items-center rounded px-4 bg-slate-300"></Skeleton>
        <Skeleton className="inline-flex h-10 w-[2.5rem] items-center rounded px-4 bg-slate-300"></Skeleton>
        <Skeleton className="inline-flex h-10 w-[2.5rem] items-center rounded px-4 bg-slate-300"></Skeleton>
      </div>
      <Skeleton className="w-[6rem] h-10 bg-slate-300 rounded justify-end" />
    </div>
  );
}
