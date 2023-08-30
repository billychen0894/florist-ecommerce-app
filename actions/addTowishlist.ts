'use server';

import { users } from '@lib/api/users';
import { AxiosInstance } from 'axios';

export const addToWishlist = async (
  productId: string,
  userId: string,
  axiosWithAuth: AxiosInstance
) => {
  const response = await users.addToUserWishlist(
    productId,
    userId,
    axiosWithAuth
  );
  const wishlist = response.data.data?.wishlist
    ? response.data.data.wishlist
    : [];

  return wishlist;
};
