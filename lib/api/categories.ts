import axios from '@lib/axios';
import { ApiResponse } from '@lib/types/api';
import { Category } from '@prisma/client';
import { AxiosResponse } from 'axios';

async function getAllCategories(): Promise<
  AxiosResponse<ApiResponse<Category[]>>
> {
  const response = (await axios.get(`/api/categories`)) as AxiosResponse<
    ApiResponse<Category[]>
  >;
  return response as AxiosResponse<ApiResponse<Category[]>>;
}

export const categories = {
  getAllCategories,
};
