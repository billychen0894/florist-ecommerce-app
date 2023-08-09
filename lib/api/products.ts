import axios from '@lib/axios';
import { ApiResponse, Filter, Product, Sort } from '@lib/types/api';
import { AxiosResponse } from 'axios';

async function getAllProducts() {
  const response = (await axios.get(`/api/products`)) as AxiosResponse<
    ApiResponse<Product[]>
  >;

  return response;
}

async function getProductById(productId: string) {
  const response = (await axios.get(
    `/api/products/${productId}`
  )) as AxiosResponse<ApiResponse<Product>>;

  return response;
}

async function searchProductsByKeyword(keyword: string) {
  const response = (await axios.get(
    `/api/products/search?keyword=${keyword}`
  )) as AxiosResponse<ApiResponse<Product[]>>;

  return response;
}

async function filterAndSortProducts(sort: Sort, filters: Filter[]) {
  const sortQuery = sort ? `sort=${sort}` : '';
  let filterQuery: string = '';

  if (filters.length > 0) {
    filterQuery = filters.map((filter) => `filter=${filter}`).join('&');
  }

  const response = (await axios.get(
    `/api/products/filter-and-sort?${sortQuery}&${filterQuery}`
  )) as AxiosResponse<ApiResponse<Product[]>>;

  return response;
}

export const products = {
  getAllProducts,
  getProductById,
  searchProductsByKeyword,
  filterAndSortProducts,
};
