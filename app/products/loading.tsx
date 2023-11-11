import React from 'react';

export default function LoadingPage() {
  return (
    <div className="h-max my-4">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 h-6">
        <div className="w-24 h-full bg-slate-100 animate-pulse rounded" />
      </div>
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:max-w-7xl lg:px-8 mt-4">
        <div className="h-40 w-full bg-slate-200 animate-pulse rounded" />
        <div className="flex items-center justify-between pt-6">
          <div className="w-12 h-6 bg-slate-100 animate-pulse rounded" />
          <div className="w-12 h-6 bg-slate-100 animate-pulse rounded" />
        </div>
        <div className="mt-6 grid grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2 sm:gap-y-10 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
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
      </div>
    </div>
  );
}
