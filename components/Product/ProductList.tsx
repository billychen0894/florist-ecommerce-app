import { TProduct } from '@lib/types/api';
import { ProductItem } from './ProductItem';
import React from 'react';
import { parseSearchParams } from '@lib/parseSearchParams';
import { buildQueryFilters } from '@lib/buildQueryFilters';
import { prisma } from '@lib/prisma';

interface ProductListProps {
  showCategory?: boolean;
  isWishlistBtnToggle?: boolean;
  searchParams: { [key: string]: string | string[] | undefined };
}

export async function ProductList({
  searchParams,
  showCategory = false,
  isWishlistBtnToggle,
}: ProductListProps) {
  const { page, limit, sort, keyword, category } =
    parseSearchParams(searchParams);
  const queryFilters = buildQueryFilters(category, keyword);

  const products = (await fetchProducts({
    page,
    limit,
    sort,
    queryFilters,
  })) as TProduct[];
  return (
    <>
      {products && products.length > 0 ? (
        products.map((product) => (
          <ProductItem
            key={product.id}
            product={product}
            showCategory={showCategory}
            isWishlistBtnToggle={isWishlistBtnToggle}
          />
        ))
      ) : (
        <p className="text-sm text-gray-400 col-span-full text-center">
          No products found.
        </p>
      )}
    </>
  );
}

async function fetchProducts({
  page,
  limit,
  sort,
  queryFilters,
}: {
  page: number;
  limit: number;
  sort: string;
  queryFilters: any;
}) {
  const price = sort === 'price-high-to-low' ? 'desc' : 'asc';
  const newest = sort === 'newest' ? 'desc' : 'asc';
  const popular = sort === 'popular' ? 'desc' : 'asc';
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        price: true,
        images: true,
        categories: true,
      },
      skip: (page - 1) * limit,
      take: limit,
      orderBy: [
        { price: price },
        {
          orderItems: {
            _count: popular,
          },
        },
        { createdAt: newest },
      ],
      where: queryFilters,
    });
    return products;
  } catch (err) {
    console.error(err);
  }
}
