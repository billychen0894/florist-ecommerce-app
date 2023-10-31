import axios from '@lib/axios';
import { ApiResponse, TProduct } from '@lib/types/api';
import { AxiosResponse } from 'axios';

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
  filters && Array.isArray(filters) && filters.length > 0
    ? filters.forEach((filter) => params.append('filter', filter))
    : typeof filters === 'string' && filters
    ? params.append('filter', filters)
    : undefined;
  search ? params.append('keyword', search) : undefined;

  const response = (await axios.get(`/api/products`, {
    params: params,
  })) as AxiosResponse<ApiResponse<TProduct[]>>;

  return response;
};

const getProductById = async (productId: string) => {
  const response = (await axios.get(
    `/api/products/${productId}`
  )) as AxiosResponse<ApiResponse<TProduct>>;

  return response;
};

export const products = {
  getAllProducts,
  getProductById,
};
