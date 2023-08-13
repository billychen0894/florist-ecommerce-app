import { ApiResponse, User } from '@lib/types/api';
import { AxiosInstance } from 'axios';

async function getAllUsers(
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<User[]>> {
  const response = (await axiosWithAuth.get('/api/admin/users')) as ApiResponse<
    User[]
  >;

  return response;
}

async function createProduct(
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.post(
    '/api/admin/products'
  )) as ApiResponse<null>;
  return response;
}

export const admin = {
  getAllUsers,
  createProduct,
};
