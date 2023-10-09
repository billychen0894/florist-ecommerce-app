import { ApiResponse, DiscountCoupon, User } from '@lib/types/api';
import { AxiosInstance, AxiosResponse } from 'axios';
import { Order } from '@prisma/client';

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

async function deleteOrderById(
  orderId: string,
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.delete(
    `/api/admin/orders/${orderId}`
  )) as ApiResponse<null>;

  return response;
}

async function updateOrderById(
  orderId: string,
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.put(
    `/api/admin/orders/${orderId}`
  )) as ApiResponse<null>;

  return response;
}

async function createCoupons(
  couponsData: DiscountCoupon[],
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<DiscountCoupon[]>> {
  const response = (await axiosWithAuth.post(`/api/admin/discount-coupons`, {
    coupons: couponsData,
  })) as ApiResponse<DiscountCoupon[]>;
  return response;
}

async function getCoupons(
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<DiscountCoupon[]>> {
  const response = (await axiosWithAuth.get(
    '/api/admin/discount-coupons'
  )) as ApiResponse<DiscountCoupon[]>;
  return response;
}

async function deleteCouponByCouponNumber(
  couponNumber: string,
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<null>> {
  const response = (await axiosWithAuth.delete(
    `/api/admin/discount-coupons/${couponNumber}`
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
  deleteCategoryById,
  getOrders,
  deleteOrderById,
  updateOrderById,
  createCoupons,
  getCoupons,
  deleteCouponByCouponNumber,
  deleteUserById,
};
