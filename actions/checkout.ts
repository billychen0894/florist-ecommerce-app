'use server';

import { orders } from '@lib/api/orders';
import { TCartItem } from '@lib/types/api';

export const checkout = async (orderItems: TCartItem[]) => {
  const response = await orders.checkout(orderItems);
  const result = response.data;
  return response.data;
};
