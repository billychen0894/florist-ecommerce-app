import { ArrowSmallLeftIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

export default function Denied() {
  return (
    <main className="relative isolate min-h-full">
      <img
        src="/images/cover4.jpg"
        alt="Red flowers background image"
        className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
      />
      <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
        <p className="text-base font-semibold leading-8 text-white">Oh no...</p>
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">
          Access Denied
        </h1>
        <p className="mt-4 text-base text-white/95 sm:mt-6">
          Sorry, you don't have access to this page even though you are
          currently signed in.
        </p>
        <Link
          href="/"
          className="text-sm font-semibold leading-7 text-white group"
        >
          <div className="mt-10 inline-flex justify-center items-center group-hover:text-secondary-500">
            <ArrowSmallLeftIcon className="h-5 w-5 text-white group-hover:text-secondary-500" />
            Back to home
          </div>
        </Link>
      </div>
    </main>
  );
}