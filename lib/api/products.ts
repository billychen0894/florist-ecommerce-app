import axios from '@lib/axios';
import { ApiResponse, Filter, Sort, TProduct } from '@lib/types/api';
import { AxiosResponse } from 'axios';
import { cache } from 'react';

export const revalidate = 3600;

const getAllProducts = cache(
  async (
    page?: number,
    limit?: number,
    sort?: 'popular' | 'newest' | 'price-high-to-low' | 'price-low-to-high',
    filters?: string | string[] | undefined
  ) => {
    const params = new URLSearchParams();
    page ? params.append('page', page.toString()) : undefined;
    limit ? params.append('limit', limit.toString()) : undefined;
    sort ? params.append('sort', sort) : undefined;
    filters && Array.isArray(filters) && filters.length > 0
      ? filters.forEach((filter) => params.append('filter', filter))
      : typeof filters === 'string' && filters
      ? params.append('filter', filters)
      : undefined;

    const response = (await axios.get(`/api/products`, {
      params: params,
    })) as AxiosResponse<ApiResponse<TProduct[]>>;

    return response;
  }
);

const getProductById = cache(async (productId: string) => {
  const response = (await axios.get(
    `/api/products/${productId}`
  )) as AxiosResponse<ApiResponse<TProduct>>;

  return response;
});

const searchProductsByKeyword = cache(async (keyword: string) => {
  const response = (await axios.get(
    `/api/products/search?keyword=${keyword}`
  )) as AxiosResponse<ApiResponse<TProduct[]>>;

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
  )) as AxiosResponse<ApiResponse<TProduct[]>>;

  return response;
});

export const products = {
  getAllProducts,
  getProductById,
  searchProductsByKeyword,
  filterAndSortProducts,
};
