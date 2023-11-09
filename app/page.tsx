import Link from 'next/link';

import { Hero } from '@components/Homepage';
import { ProductList } from '@components/Product';
import { products } from '@lib/api/products';
import { generateBase64 } from '@actions/generateBase64';
import { heroUrl } from '@const/hero';
import { ApiResponse, TProduct } from '@lib/types/api';
import { AxiosResponse } from 'axios';

export default async function Home() {
  const promises = [
    await products.getAllProducts(1, 9, 'popular'),
    await generateBase64(
      `https://res.cloudinary.com/${process.env.CLOUDINARY_CLOUD_NAME}/image/upload/${heroUrl}`
    ),
  ];
  const [productsRes, heroBase64Url] = (await Promise.all(promises)) as [
    AxiosResponse<ApiResponse<TProduct[]>, any>,
    string
  ];
  const top9PopularProducts = productsRes?.data?.data
    ? productsRes?.data?.data
    : [];

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
