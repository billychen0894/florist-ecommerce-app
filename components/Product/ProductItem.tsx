import { formatCurrency } from '@lib/formatCurrency';
import { TProduct } from '@lib/types/api';
import Image from 'next/image';
import Link from 'next/link';
import dynamic from 'next/dynamic';
import React from 'react';

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
  const ProductWishlistButton = dynamic(
    () => import('@components/Product/ProductWishlistButton')
  );

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
          {isWishlistBtnToggle && <ProductWishlistButton product={product} />}
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
