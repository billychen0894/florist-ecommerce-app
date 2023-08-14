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

async function updateProductById(
  productId: string,
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.put(
    `/api/admin/products/${productId}`
  )) as ApiResponse<null>;
  return response;
}

async function deleteProductById(
  productId: string,
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.delete(
    `/api/admin/products/${productId}`
  )) as ApiResponse<null>;
  return response;
}

async function createCategory(
  name: string,
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.post('/api/admin/categories', {
    name,
  })) as ApiResponse<null>;
  return response;
}

async function updateCategoryById(
  data: { categoryId: string; name: string },
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.put(
    `/api/admin/categories/${data.categoryId}`,
    {
      name: data.name,
    }
  )) as ApiResponse<null>;

  return response;
}

export const admin = {
  getAllUsers,
  createProduct,
  updateProductById,
  deleteProductById,
  createCategory,
  updateCategoryById,
};
