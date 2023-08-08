import axios from '@lib/axios';
import { ApiResponse, Categories } from '@lib/types/api';

async function getAllCategories(): Promise<ApiResponse<Categories[]>> {
  const response = (await axios.get(`/api/categories`)) as ApiResponse<
    Categories[]
  >;
  return response;
}

export const categories = {
  getAllCategories,
};
