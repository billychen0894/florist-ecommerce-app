import axios from '@lib/axios';
import { ApiResponse, Order, TCartItem } from '@lib/types/api';
import { AxiosInstance, AxiosResponse } from 'axios';

async function getUserOrders(
  userId: string,
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<ApiResponse<Order[]>>> {
  const response = (await axiosWithAuth.get(
    `/api/orders/users/${userId}`
  )) as AxiosResponse<ApiResponse<Order[]>>;

  return response;
}

async function checkout(orders: TCartItem[], userId?: string) {
  const response = await axios.post('api/checkout', {
    orders,
    userId: userId,
  });

  return response;
}

export const orders = {
  getUserOrders,
  checkout,
};
