'use client';

import { useCartStore } from '@/components/Providers/CartStoreProvider';
import { cn } from '@/lib/classNames';
import { ShoppingBagIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';

export default function NavCart() {
  const cartItems = useCartStore((state) => state.cartItems);
  const cartItemsArr = Object.values(cartItems);

  return (
    <div className="ml-4 flow-root lg:ml-6 relative">
      <Link
        href={{ pathname: '/cart' }}
        className="group -m-2 flex items-center p-2"
        data-cy="header-nav-cart"
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
