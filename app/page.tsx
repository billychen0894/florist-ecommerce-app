import Link from 'next/link';
import { ProductList } from '@components/Product';
import { generateBase64 } from '@actions/generateBase64';
import { heroUrl } from '@const/hero';
import { Hero } from '@components/Homepage/Hero';
import { Suspense } from 'react';
import ProductListSkeleton from '@components/Product/ProductListSkeleton';

export default async function Home() {
  const heroBase64Url = await generateBase64(
    `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${heroUrl}`
  );

  return (
    <div className="bg-white">
      <Hero heroBase64Url={heroBase64Url} />
      <main>
        {/* Popular section */}
        <section aria-labelledby="popular-heading">
          <div className="mx-auto max-w-7xl px-4 py-24 sm:px-6 sm:py-32 lg:px-8">
            {/* Section header */}
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
            {/* Product Grid List */}
            <Suspense
              fallback={
                <ProductListSkeleton length={9} className="lg:grid-cols-3" />
              }
            >
              <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-8">
                <ProductList
                  searchParams={{ page: '1', limit: '9', sort: 'popular' }}
                />
              </div>
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
