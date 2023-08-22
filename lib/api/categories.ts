import axios from '@lib/axios';
import { ApiResponse, Categories } from '@lib/types/api';
import { AxiosResponse } from 'axios';

async function getAllCategories(): Promise<
  AxiosResponse<ApiResponse<Categories[]>>
> {
  const response = (await axios.get(`/api/categories`)) as AxiosResponse<
    ApiResponse<Categories[]>
  >;
  return response as AxiosResponse<ApiResponse<Categories[]>>;
}

export const categories = {
  getAllCategories,
};
