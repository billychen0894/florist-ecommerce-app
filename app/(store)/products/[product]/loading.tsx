import React from 'react';

export default function LoadingPage() {
  return (
    <div className="h-screen mx-auto max-w-7xl sm:px-6 sm:pt-16 lg:px-8">
      <div className="mx-auto max-w-2xl lg:max-w-none">
        {/* Product */}
        <div className="lg:grid lg:grid-cols-2 lg:items-start lg:gap-x-8">
          {/* Image gallery */}
          <div className="flex flex-col-reverse">
            <div className="mx-auto mt-6 hidden w-full max-w-2xl sm:block lg:max-w-none">
              <div className="grid grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, i) => (
                  <div
                    key={i}
                    className="flex h-28 rounded-md bg-slate-300 animate-pulse"
                  />
                ))}
              </div>
            </div>

            <div className="aspect-h-1 aspect-w-1 w-full bg-slate-300 animate-pulse rounded"></div>
          </div>

          {/* Product info */}
          <div className="hidden lg:block w-full h-full mt-10 px-4 sm:mt-16 sm:px-0 lg:mt-0 overflow-hidden">
            <div className="w-[24rem] h-[3rem] bg-slate-400 animate-pulse rounded" />
            <div className="mt-3 space-y-3">
              <div className="w-[10rem] h-[2rem] bg-slate-400 animate-pulse rounded" />
              <div className="w-[10rem] h-[2.5rem] bg-slate-400 animate-pulse rounded" />
            </div>
            <div className="mt-6">
              <div className="w-[26rem] h-[1rem] bg-slate-300 animate-pulse rounded mt-1" />
              <div className="w-[22rem] h-[1rem] bg-slate-300 animate-pulse rounded mt-1" />
              <div className="w-[20rem] h-[1rem] bg-slate-300 animate-pulse rounded mt-1" />
            </div>
            <div className="mt-6">
              <div className="mt-10 flex h-12">
                <div className="mr-4 w-[10rem] h-full bg-slate-200 animate-pulse rounded" />
                <div className="w-full h-full bg-slate-200 animate-pulse rounded" />
                <div className="ml-4 w-[8rem] h-full bg-slate-200 animate-pulse rounded" />
              </div>
            </div>
            <div className="mt-12">
              <div>
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="mt-2">
                    <div className="w-full h-[2rem] bg-slate-100 animate-pulse rounded" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
