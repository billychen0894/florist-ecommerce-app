import Link from 'next/link';

import { Hero } from '@components/Homepage';
import { ProductList } from '@components/Product';
import { products } from '@lib/api/products';

export const dynamic = 'force-dynamic';

export default async function Home() {
  const response = await products.getAllProducts(1, 9, 'popular');
  const allProducts = await response.data.data;
  const top9PopularProducts = allProducts ? allProducts : [];
  return (
    <div className="bg-white">
      <Hero />
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
            <div className="mt-6 grid grid-cols-1 gap-y-10 sm:grid-cols-3 sm:gap-x-6 lg:gap-x-8">
              <ProductList productsList={top9PopularProducts || []} />
            </div>

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
