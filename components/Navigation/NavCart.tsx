'use client';

import Link from '@node_modules/next/link';
import { ShoppingBagIcon } from '@node_modules/@heroicons/react/24/outline';
import { cn } from '@lib/classNames';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect } from 'react';
import { getCartItemsFromLocalStorage } from '@lib/getCartItemsFromLocalStorage';
import { initializeCart } from '@store/features/cartSlice';

export default function NavCart() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (typeof window !== undefined) {
      const cachedCartItems = getCartItemsFromLocalStorage();
      dispatch(initializeCart(cachedCartItems));
    }
  }, [dispatch]);

  const cartItems = useAppSelector((state) => state.cartReducer.cartItems);
  const cartItemsArr = Object.values(cartItems);

  return (
    <div className="ml-4 flow-root lg:ml-6 relative">
      <Link
        href={{ href: '/cart' }}
        className="group -m-2 flex items-center p-2"
      >
        <ShoppingBagIcon
          className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-secondary-500"
          aria-hidden="true"
        />
        <span
          className={cn(
            'text-xs font-medium text-gray-700 group-hover:text-gray-800 absolute top-1 right-0.5 transfrom translate-x-1/2 -translate-y-1/2 text-center',
            `${
              cartItemsArr.length > 0
                ? 'text-white rounded-full bg-red-500 group-hover:text-white h-4 w-4'
                : null
            }`,
            `${cartItemsArr.length >= 10 ? 'text-[10px]' : null}`
          )}
        >
          {cartItemsArr.length > 0 ? cartItemsArr.length : null}
        </span>
        <span className="sr-only">items in cart, view bag</span>
      </Link>
    </div>
  );
}
