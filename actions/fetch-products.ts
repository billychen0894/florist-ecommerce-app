'use server';

import { products } from '@lib/api/products';

export const fetchProducts = async (
  page?: number,
  limit?: number,
  sortOption?: string,
  filters?: string | string[] | undefined,
  search?: string | undefined
) => {
  let sort: 'popular' | 'newest' | 'price-high-to-low' | 'price-low-to-high' =
    'popular';
  if (sortOption === 'popular') {
    sort = 'popular';
  } else if (sortOption === 'newest') {
    sort = 'newest';
  } else if (sortOption === 'price-high-to-low') {
    sort = 'price-high-to-low';
  } else {
    sort = 'price-low-to-high';
  }

  const data = await products.getAllProducts(
    page,
    limit,
    sort,
    filters,
    search
  );
  return data.data;
};
