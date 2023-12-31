import { ApiResponse, ProductReqPayload, User } from '@lib/types/api';
import { AxiosInstance, AxiosResponse } from 'axios';
import { Order, OrderStatus } from '@prisma/client';

async function getAllUsers(
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<ApiResponse<User[]>>> {
  const response = (await axiosWithAuth.get(
    '/api/admin/users'
  )) as AxiosResponse<ApiResponse<User[]>>;

  return response;
}

async function deleteUserById(
  userId: string,
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.delete(
    `/api/admin/users/${userId}`
  )) as ApiResponse<null>;

  return response;
}

async function createProduct(
  data: ProductReqPayload,
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.post('/api/admin/products', {
    ...data,
  })) as ApiResponse<null>;
  return response;
}

async function updateProductById(
  productId: string,
  data: ProductReqPayload,
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.put(
    `/api/admin/products/${productId}`,
    { ...data }
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

async function deleteCategoryById(
  categoryId: string,
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.delete(
    `/api/admin/categories/${categoryId}`
  )) as ApiResponse<null>;

  return response;
}

async function getOrders(
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<ApiResponse<Order[]>>> {
  const response = (await axiosWithAuth.get(
    '/api/admin/orders'
  )) as AxiosResponse<ApiResponse<Order[]>>;

  return response;
}

async function updateOrderByStripeId(
  orderId: string,
  data: {
    orderStatus: OrderStatus;
  },
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.put(`/api/admin/orders/${orderId}`, {
    ...data,
  })) as ApiResponse<null>;

  return response;
}

export const admin = {
  getAllUsers,
  createProduct,
  updateProductById,
  deleteProductById,
  createCategory,
  deleteCategoryById,
  getOrders,
  updateOrderByStripeId,
  deleteUserById,
};
