import { Skeleton } from '@/components/ui/Skeleton';

export default function ProfileAndSettingsSkeleton() {
  return (
    <Skeleton className="md:col-span-2 space-y-10">
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
        <div className="col-span-full">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
        <div className="sm:col-span-2">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
        <div className="sm:col-span-2">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
        <div className="sm:col-span-2">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
      </div>
    </Skeleton>
  );
}
