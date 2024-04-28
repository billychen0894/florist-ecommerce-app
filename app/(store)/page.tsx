import { Hero } from '@/components/Homepage/Hero';
import PopularProducts from '@/components/Product/PopularProducts';
import ProductListSkeleton from '@/components/Product/ProductListSkeleton';
import Link from 'next/link';
import { Suspense } from 'react';

export default async function Home() {
  return (
    <div className="bg-white">
      <Hero />
      <main>
        <section aria-labelledby="popular-heading">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            <div className="sm:flex sm:items-baseline sm:justify-between">
              <h2
                id="popular-heading"
                className="text-2xl font-bold tracking-tight text-black"
              >
                Popular
              </h2>
              <Link
                href="/products"
                className="hidden text-sm font-semibold text-secondary-500 hover:text-secondary-400 sm:block"
              >
                Browse all products
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
            <Suspense
              fallback={
                <ProductListSkeleton length={9} className="lg:grid-cols-3" />
              }
            >
              <PopularProducts />
            </Suspense>
            <div className="mt-6 sm:hidden">
              <Link
                href="/products"
                className="block text-sm font-semibold text-secondary-500 hover:text-secondary-400"
              >
                Browse all products
                <span aria-hidden="true"> &rarr;</span>
              </Link>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
