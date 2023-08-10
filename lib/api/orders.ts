import axios from '@lib/axios';
import { ApiResponse, OrderPayload } from '@lib/types/api';
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

export const orders = {
  createOrder,
};
