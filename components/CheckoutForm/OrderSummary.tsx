'use client';

import { TrashIcon } from '@heroicons/react/20/solid';
import Image from 'next/image';
import Link from 'next/link';

import { HoverCard } from '@components/ui';
import Button from '@components/ui/Button';
import { shippingHoverCardInfo, taxHoverCardInfo } from '@const/orderInfo';
import { formatCurrency } from '@lib/formatCurrency';
import {
  removeItemFromCart,
  updateCartItemQuantity,
} from '@store/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { ChangeEvent } from 'react';

export default function OrderSummary() {
  const cartItems = useAppSelector((state) => state.cartReducer.cartItems);
  const subtotal = useAppSelector((state) => state.cartReducer.subtotal);
  const dispatch = useAppDispatch();
  const cartItemsArr = Object.values(cartItems);

  const handleRemoveItemFromCart = (itemId: string) => {
    dispatch(removeItemFromCart({ itemId }));
  };

  const handleCartItemQuantity = (itemId: string, quantity: number) => {
    dispatch(updateCartItemQuantity({ itemId, quantity }));
  };

  return (
    <div className="mt-10 lg:mt-0">
      <h2 className="text-lg font-medium text-gray-900">Order summary</h2>

      <div className="mt-4 rounded-lg border border-gray-200 bg-white shadow-sm">
        <h3 className="sr-only">Items in your cart</h3>
        <ul role="list" className="divide-y divide-gray-200">
          {cartItemsArr.map((cartItem) => (
            <li key={cartItem.id} className="flex px-4 py-6 sm:px-6">
              <div className="flex-shrink-0">
                <Image
                  src={cartItem.product.images[0].url}
                  alt={cartItem.product.images[0].alt}
                  className="w-20 rounded-md"
                  width={80}
                  height={80}
                />
              </div>

              <div className="ml-6 flex flex-1 flex-col">
                <div className="flex">
                  <div className="min-w-0 flex-1">
                    <h4 className="text-sm">
                      <Link
                        href={`/products/${cartItem.product.id}`}
                        className="font-medium text-gray-800 hover:text-gray-500"
                      >
                        {cartItem.product.name}
                      </Link>
                    </h4>
                    <p className="mt-1 text-sm text-shades-500">
                      {cartItem.product.categories
                        .map((category) => category.name)
                        .join(' ,')}
                    </p>
                  </div>

                  <div className="ml-4 flow-root flex-shrink-0">
                    <Button
                      type="button"
                      className="-m-2.5 flex items-center justify-center bg-white p-2.5 text-gray-400 hover:text-gray-500 hover:bg-transparent shadow-none"
                      onClick={() => {
                        handleRemoveItemFromCart(cartItem.id);
                      }}
                    >
                      <span className="sr-only">Remove</span>
                      <TrashIcon className="h-5 w-5" aria-hidden="true" />
                    </Button>
                  </div>
                </div>

                <div className="flex flex-1 items-end justify-between pt-2">
                  <p className="mt-1 text-sm font-medium text-secondary-500">
                    {formatCurrency(cartItem.product.price, 'en-CA', 'CAD')}
                  </p>

                  <div className="ml-4">
                    <label htmlFor="quantity" className="sr-only">
                      Quantity
                    </label>
                    <select
                      id="quantity"
                      name="quantity"
                      className="rounded-md border border-gray-300 text-left text-base font-medium text-gray-700 shadow-sm focus:border-primary-500 focus:outline-none focus:ring-1 focus:ring-primary-500 sm:text-sm"
                      value={cartItem.quantity}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) => {
                        const selectedQuantity = e.target.value;
                        handleCartItemQuantity(
                          cartItem.id,
                          Number(selectedQuantity)
                        );
                      }}
                    >
                      {[...Array(10)].map((_, i) => (
                        <option key={i} value={i + 1}>
                          {i + 1}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
        {/* TODO: Implement dynamic pricing and taxes */}
        <dl className="space-y-6 border-t border-gray-200 px-4 py-6 sm:px-6">
          <div className="flex items-center justify-between">
            <dt className="text-sm">Subtotal</dt>
            <dd className="text-sm font-medium text-gray-900">
              {formatCurrency(subtotal, 'en-CA', 'CAD')}
            </dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex text-sm">
              <span>Shipping</span>
              <HoverCard
                screenReaderText={shippingHoverCardInfo.screenReaderText}
                hoverCardText={shippingHoverCardInfo.hoverCardText}
              />
            </dt>
            <dd className="text-sm font-medium text-gray-900">$5.00</dd>
          </div>
          <div className="flex items-center justify-between">
            <dt className="flex text-sm">
              <span>Taxes</span>
              <HoverCard
                screenReaderText={taxHoverCardInfo.screenReaderText}
                hoverCardText={taxHoverCardInfo.hoverCardText}
              />
            </dt>
            <dd className="text-sm font-medium text-gray-900">$5.52</dd>
          </div>
          <div className="flex items-center justify-between border-t border-gray-200 pt-6">
            <dt className="text-base font-medium">Total</dt>
            <dd className="text-base font-medium text-gray-900">$75.52</dd>
          </div>
        </dl>

        <div className="border-t border-gray-200 px-4 py-6 sm:px-6">
          <Button
            type="submit"
            className="w-full border border-transparent px-4 py-3 text-base font-medium focus:outline-none focus:ring-2 focus:ring-primary-400 focus:ring-offset-2 focus:ring-offset-gray-50"
          >
            Confirm order
          </Button>
        </div>
      </div>
    </div>
  );
}
