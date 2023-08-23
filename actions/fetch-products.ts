'use server';

import { products } from '@lib/api/products';
import { ProductItem } from '@lib/types/types';

export const fetchProducts = async (
  page: number,
  limit: number,
  sortOption: string
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

  const response = await products.getAllProducts(page, limit, sort);
  const allProducts = response.data.data
    ? (response.data.data as ProductItem[])
    : [];
  return allProducts;
};
