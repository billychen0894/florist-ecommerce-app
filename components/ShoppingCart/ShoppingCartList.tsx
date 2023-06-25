import { CheckIcon, ClockIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';

import { Product } from '@const/products';
import { ShoppingCartCountSelect } from './ShoppingCartCountSelect';

interface ShoppingCartListProps {
  products: Product[];
}

export function ShoppingCartList({ products }: ShoppingCartListProps) {
  return (
    <section aria-labelledby="cart-heading" className="lg:col-span-7">
      <h2 id="cart-heading" className="sr-only">
        Items in your shopping cart
      </h2>

      <ul
        role="list"
        className="divide-y divide-gray-200 border-b border-t border-gray-200"
      >
        {products.map((product, productIdx) => (
          <li key={product.id} className="flex py-6 sm:py-10">
            <div className="flex-shrink-0">
              <Image
                src={product.images[0].imageUrl}
                alt={product.images[0].alt || product.name}
                className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                width={200}
                height={200}
              />
            </div>

            <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
              <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                {/* Product Info */}
                <div>
                  <div className="flex justify-between">
                    <h3 className="text-sm">
                      <Link
                        // TODO: Implement product page link
                        href="/products/#"
                        className="font-medium text-gray-700 hover:text-gray-800"
                      >
                        {product.name}
                      </Link>
                    </h3>
                  </div>
                  <div className="mt-1 flex text-sm">
                    <p className="text-shades-500">{product.category}</p>
                  </div>
                  <p className="mt-1 text-sm font-medium text-gray-900">
                    ${product.price}
                  </p>
                </div>

                <ShoppingCartCountSelect
                  product={product}
                  productIdx={productIdx}
                  selectCounts={10}
                />
              </div>

              <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                {product.inStock ? (
                  <CheckIcon
                    className="h-5 w-5 flex-shrink-0 text-green-500"
                    aria-hidden="true"
                  />
                ) : (
                  <ClockIcon
                    className="h-5 w-5 flex-shrink-0 text-gray-300"
                    aria-hidden="true"
                  />
                )}

                <span>
                  {product.inStock
                    ? 'In stock'
                    : `Ships in ${product.leadTime}`}
                </span>
              </p>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
