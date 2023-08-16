import axios from '@lib/axios';
import { ApiResponse, Filter, Product, Sort } from '@lib/types/api';
import { AxiosResponse } from 'axios';
import { cache } from 'react';

export const revalidate = 3600;

const getAllProducts = cache(
  async (
    sort: 'asc' | 'desc' = 'asc',
    limit: number = 12,
    sortByOrderItems: 'asc' | 'desc' = 'asc'
  ) => {
    const response = (await axios.get(`/api/products`, {
      params: {
        sort,
        limit,
        sortByOrderItems,
      },
    })) as AxiosResponse<ApiResponse<Product[]>>;

    return response;
  }
);

const getProductById = cache(async (productId: string) => {
  const response = (await axios.get(
    `/api/products/${productId}`
  )) as AxiosResponse<ApiResponse<Product>>;

  return response;
});

const searchProductsByKeyword = cache(async (keyword: string) => {
  const response = (await axios.get(
    `/api/products/search?keyword=${keyword}`
  )) as AxiosResponse<ApiResponse<Product[]>>;

  return response;
});

const filterAndSortProducts = cache(async (sort: Sort, filters: Filter[]) => {
  const sortQuery = sort ? `sort=${sort}` : '';
  let filterQuery: string = '';

  if (filters.length > 0) {
    filterQuery = filters.map((filter) => `filter=${filter}`).join('&');
  }

  const response = (await axios.get(
    `/api/products/filter-and-sort?${sortQuery}&${filterQuery}`
  )) as AxiosResponse<ApiResponse<Product[]>>;

  return response;
});

export const products = {
  getAllProducts,
  getProductById,
  searchProductsByKeyword,
  filterAndSortProducts,
};
