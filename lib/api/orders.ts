import axios from '@lib/axios';
import { ApiResponse, Order, OrderPayload, TCartItem } from '@lib/types/api';
import { AxiosInstance, AxiosResponse } from 'axios';

async function createOrder(
  orderData: OrderPayload,
  axiosWithAuth?: AxiosInstance
): Promise<AxiosResponse<ApiResponse<null>>> {
  const response = axiosWithAuth
    ? ((await axiosWithAuth.post('/api/orders', {
        orderData,
      })) as AxiosResponse<ApiResponse<null>>)
    : ((await axios.post('/api/orders', {
        orderData,
      })) as AxiosResponse<ApiResponse<null>>);

  return response;
}

async function getUserOrders(
  userId: string,
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<ApiResponse<Order[]>>> {
  const response = (await axiosWithAuth.get(
    `/api/orders/users/${userId}`
  )) as AxiosResponse<ApiResponse<Order[]>>;

  return response;
}

async function searchOrders(
  orderNumber: string
): Promise<AxiosResponse<ApiResponse<Order[]>>> {
  const response = (await axios.get(
    `/api/orders/search/${orderNumber}`
  )) as AxiosResponse<ApiResponse<Order[]>>;

  return response;
}

async function checkout(
  orders: TCartItem[],
  userId?: string,
  userAssociatedStripeId?: string
) {
  const response = await axios.post('api/checkout', {
    orders,
    userId: userId,
    userAssociatedStripeId: userAssociatedStripeId,
  });

  return response;
}

export const orders = {
  createOrder,
  getUserOrders,
  searchOrders,
  checkout,
};
