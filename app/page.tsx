import { Hero } from '@components/Homepage';
import Image from 'next/image';
import Link from 'next/link';

import { products } from '@const/products';

export default function Home() {
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
              {products.map((product) => (
                <div key={product.id} className="group relative">
                  <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg bg-gray-100">
                    <Image
                      src={product.imageUrl.primaryImage}
                      alt={product.name}
                      className="object-cover object-center"
                      width={200}
                      height={400}
                    />
                    <div
                      className="flex items-end p-4 opacity-0 group-hover:opacity-100"
                      aria-hidden="true"
                    >
                      <div className="w-full rounded-md bg-white bg-opacity-75 px-4 py-2 text-center text-sm font-medium text-black backdrop-blur backdrop-filter">
                        View Product
                        <span className="sr-only">{product.name}</span>
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex items-center justify-between space-x-8 text-base font-medium text-black">
                    <h3>
                      {/* TODO: Implement Product Link Page */}
                      <Link href="#">
                        <span aria-hidden="true" className="absolute inset-0" />
                        {product.name}
                      </Link>
                    </h3>
                    <p>${product.price}</p>
                  </div>
                </div>
              ))}
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
