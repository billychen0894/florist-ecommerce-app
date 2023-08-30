'use server';

import { users } from '@lib/api/users';
import { AxiosInstance } from 'axios';

export const removeFromWishlist = async (
  productId: string,
  userId: string,
  axiosWithAuth: AxiosInstance
) => {
  const response = await users.deleteProductFromWishlist(
    productId,
    userId,
    axiosWithAuth
  );
  return response.data;
};
