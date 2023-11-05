'use client';

import { formatCurrency } from '@lib/formatCurrency';
import { TProduct } from '@lib/types/api';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';
import Button from '@components/ui/Button';
import { HeartIcon as HeartIconSolid } from '@heroicons/react/24/solid';
import { useAppDispatch } from '@store/hooks';
import { useSession } from 'next-auth/react';
import { removeProductsFromWishlist } from '@store/features/userSlice';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { users } from '@lib/api/users';

interface ProductItemProps {
  product: TProduct;
  showCategory?: boolean;
  isWishlistBtnToggle?: boolean;
}

export function ProductItem({
  product,
  showCategory = false,
  isWishlistBtnToggle,
}: ProductItemProps) {
  const dispatch = useAppDispatch();
  const { data: session } = useSession();
  const axiosWithAuth = useAxiosWithAuth();

  return (
    <>
      <div className="group relative">
        <div className="aspect-h-4 aspect-w-3 overflow-hidden rounded-lg bg-gray-100 relative">
          <Image
            src={product.images[0].url}
            alt={product.images[0].alt}
            className="w-full h-full object-cover object-center"
            fill
            priority
            quality={60}
            sizes="(min-width: 1340px) 384px, (min-width: 640px) calc(29.85vw - 10px), calc(100vw - 32px)"
          />
          {isWishlistBtnToggle && (
            <div className="relative z-10">
              <Button
                type="button"
                className="absolute top-0 right-0 ml-4 flex items-center justify-center px-3 py-3 text-secondary-400 bg-transparent hover:bg-transparent shadow-none hover:text-secondary-500 transition-transform transform hover:scale-90"
                title="Add Products to Wishlist"
                onClick={() => {
                  if (session?.user) {
                    users.deleteProductFromWishlist(
                      product.id,
                      session?.user.id,
                      axiosWithAuth
                    );
                    dispatch(removeProductsFromWishlist(product));
                  }
                }}
              >
                <HeartIconSolid
                  className="h-8 w-8 flex-shrink-0"
                  aria-hidden="true"
                />
                <span className="sr-only">Add to Wishlist</span>
              </Button>
            </div>
          )}
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
          <h3 className="shrink">
            <Link
              href={`/products/${product.id}`}
              as={`/products/${product.id}`}
            >
              <span aria-hidden="true" className="absolute inset-0" />
              {product.name}
            </Link>
          </h3>
          <p className="text-secondary-500 flex-shrink-0">
            {formatCurrency(product.price, 'en-CA', 'CAD')}
          </p>
        </div>
        {showCategory &&
          product.categories &&
          product.categories.map((category) => (
            <p
              key={category.id}
              className="mt-1 text-sm text-shades-500 shrink"
            >
              {category.name}
            </p>
          ))}
      </div>
    </>
  );
}
