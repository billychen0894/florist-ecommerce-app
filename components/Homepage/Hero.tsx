import Image from 'next/image';
import Link from 'next/link';

import {
  heroCTALabel,
  heroSubtitle,
  heroTitle,
  heroUrl,
  heroUrlAlt,
} from '@const/hero';

export function Hero() {
  return (
    <div className="pb-80 pt-16 sm:pb-40 sm:pt-24 lg:pb-48 lg:pt-40 relative isolate overflow-hidden">
      {/* Background image */}
      <Image
        src={heroUrl}
        alt={heroUrlAlt}
        className="absolute inset-0 -z-10 w-full h-full object-cover"
        width={500}
        height={500}
        priority
      />
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-gray-800 bg-opacity-75 -z-10"
        aria-hidden="true"
      />
      <div className="relative mx-auto max-w-7xl px-4 sm:static sm:px-6 lg:px-8 flex flex-col justify-center items-center">
        <div className="sm:max-w-lg flex flex-col justify-center items-center text-center">
          <h1 className="text-4xl font-bold tracking-tight text-white sm:text-6xl">
            {heroTitle}
          </h1>
          <p className="mt-4 text-xl text-gray-300">{heroSubtitle}</p>
        </div>
        <div>
          <div className="mt-10">
            <Link
              href="/products"
              className="inline-block rounded-md border border-transparent bg-primary-500 px-8 py-3 text-center font-medium text-white hover:bg-primary-400"
            >
              {heroCTALabel}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
