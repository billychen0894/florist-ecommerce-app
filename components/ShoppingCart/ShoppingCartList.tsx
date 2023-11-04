'use client';

import { CheckIcon, XMarkIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';

import { formatCurrency } from '@lib/formatCurrency';
import { useAppSelector } from '@store/hooks';
import { ShoppingCartCountSelect } from './ShoppingCartCountSelect';

export function ShoppingCartList() {
  const cartItems = useAppSelector((state) => state.cartReducer.cartItems);
  const cartItemsArr = Object.values(cartItems);

  return (
    <section aria-labelledby="cart-heading" className="lg:col-span-7">
      <h2 id="cart-heading" className="sr-only">
        Items in your shopping cart
      </h2>

      {cartItemsArr.length === 0 && (
        <p className="text-gray-400 text-center">Shopping cart is empty.</p>
      )}
      {cartItemsArr.length > 0 && (
        <ul
          role="list"
          className="divide-y divide-gray-200 border-b border-t border-gray-200"
        >
          {cartItemsArr.map((orderItem) => (
            <li key={orderItem.id} className="flex py-6 sm:py-10">
              <div className="flex-shrink-0">
                <Image
                  src={orderItem.product.images[0].url}
                  alt={orderItem.product.images[0].alt}
                  className="h-24 w-24 rounded-md object-cover object-center sm:h-48 sm:w-48"
                  width={192}
                  height={192}
                  sizes="192"
                  priority
                />
              </div>

              <div className="ml-4 flex flex-1 flex-col justify-between sm:ml-6">
                <div className="relative pr-9 sm:grid sm:grid-cols-2 sm:gap-x-6 sm:pr-0">
                  {/* Product Info */}
                  <div>
                    <div className="flex justify-between">
                      <h3 className="text-sm">
                        <Link
                          href={`/products/${orderItem.product.id}`}
                          className="font-medium text-gray-800 hover:text-gray-500"
                        >
                          {orderItem.product.name}
                        </Link>
                      </h3>
                    </div>
                    <div className="mt-1 flex text-sm">
                      <p className="text-shades-500">
                        {orderItem.product.categories
                          .map((category) => category.name)
                          .join(' ,')}
                      </p>
                    </div>
                    <p className="mt-1 text-sm font-medium text-gray-900">
                      {formatCurrency(orderItem.product.price, 'en-CA', 'CAD')}
                    </p>
                  </div>

                  <ShoppingCartCountSelect
                    product={orderItem.product}
                    selectCounts={10}
                    selectedQuantity={orderItem.quantity}
                  />
                </div>

                <p className="mt-4 flex space-x-2 text-sm text-gray-700">
                  {orderItem.product.inStock ? (
                    <CheckIcon
                      className="h-5 w-5 flex-shrink-0 text-green-500"
                      aria-hidden="true"
                    />
                  ) : (
                    <XMarkIcon
                      className="h-5 w-5 flex-shrink-0 text-red-300"
                      aria-hidden="true"
                    />
                  )}

                  <span>
                    {orderItem.product.inStock ? 'In stock' : 'Restocking soon'}
                  </span>
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
