import axios from '@lib/axios';
import { ApiResponse, TProduct } from '@lib/types/api';
import { AxiosResponse } from 'axios';
import { cache } from 'react';

export const revalidate = 3600;

const getAllProducts = async (
  page?: number,
  limit?: number,
  sort?: 'popular' | 'newest' | 'price-high-to-low' | 'price-low-to-high',
  filters?: string | string[] | undefined,
  search?: string | undefined
) => {
  const params = new URLSearchParams();
  page ? params.append('page', page.toString()) : undefined;
  limit ? params.append('limit', limit.toString()) : undefined;
  sort ? params.append('sort', sort) : undefined;

  if (
    filters &&
    (Array.isArray(filters) ? filters.length > 0 : typeof filters === 'string')
  ) {
    if (Array.isArray(filters)) {
      filters.forEach((filter) => params.append('filter', filter));
    } else {
      params.append('filter', filters);
    }
  }

  search ? params.append('keyword', search) : undefined;
  const endpointUrl = new URL(`${process.env.APP_BASE_URL}/api/products`);
  endpointUrl.search = params.toString();

  try {
    const res = await fetch(endpointUrl);
    if (!res.ok) {
      throw new Error(
        `Error ${res.status}: Something went wrong while fetching products`
      );
    }
    return await res.json();
  } catch (err) {
    console.error(err);
  }
};

const getProductById = cache(async (productId: string) => {
  try {
    const response = (await axios.get(
      `/api/products/${productId}`
    )) as AxiosResponse<ApiResponse<TProduct>>;

    return response;
  } catch (err: any) {
    console.error('Error:', err.message);
    return null;
  }
});

export const products = {
  getAllProducts,
  getProductById,
};
