'use server';

import { products } from '@lib/api/products';
import { ProductItem } from '@lib/types/types';

export const fetchProducts = async (page: number, limit: number) => {
  const response = await products.getAllProducts(page, limit, 'asc');
  const allProducts = response.data.data
    ? (response.data.data as ProductItem[])
    : [];
  return allProducts;
};
