import axios from '@lib/axios';
import { ApiResponse, Order, OrderPayload } from '@lib/types/api';
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

export const orders = {
  createOrder,
  getUserOrders,
};
