'use client';

import { useEffect } from 'react';
import Image from '@node_modules/next/image';
import Button from '@components/ui/Button';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <main className="relative isolate min-h-full">
      <Image
        src="/images/cover4.jpg"
        alt="Red flowers background image"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
        width={500}
        height={500}
      />
      <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
        <p className="text-base font-semibold leading-8 text-white">Oh no...</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Something Went Wrong
        </h1>
        <p className="mt-4 text-sm text-white/95 sm:mt-6">
          Our team is actively working to resolve the issue.
        </p>
        <div className="flex justify-center items-center mt-10 gap-4">
          <Button
            type="button"
            className="bg-secondary-500 hover:bg-secondary-400"
            onClick={() => reset()}
          >
            Try again
          </Button>
        </div>
      </div>
    </main>
  );
}
