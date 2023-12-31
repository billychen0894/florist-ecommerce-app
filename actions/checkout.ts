'use server';

import { orders } from '@lib/api/orders';
import { TCartItem } from '@lib/types/api';

export const checkout = async (orderItems: TCartItem[], userId?: string) => {
  const response = await orders.checkout(orderItems, userId);

  return response.data;
};
