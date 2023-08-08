import axios from '@lib/axios';
import { ApiResponse, Product } from '@lib/types/api';
import { AxiosResponse } from 'axios';

async function getAllProducts() {
  const response = (await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products`
  )) as AxiosResponse<ApiResponse<Product[]>>;

  return response;
}

async function getProductById(productId: string) {
  const response = (await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/${productId}`
  )) as AxiosResponse<ApiResponse<Product>>;

  return response;
}

async function searchProductsByKeyword(keyword: string) {
  const response = (await axios.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/products/search?keyword=${keyword}`
  )) as AxiosResponse<ApiResponse<Product[]>>;

  return response;
}

export const products = {
  getAllProducts,
  getProductById,
};
