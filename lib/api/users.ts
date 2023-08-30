import { SignUpFormData } from '@components/Auth/SignUpForm';
import { ApiResponse, UpdatedUserData, User, WishList } from '@lib/types/api';
import { AxiosInstance, AxiosResponse } from 'axios';

async function createUser(
  userData: SignUpFormData
): Promise<ApiResponse<SignUpFormData>> {
  const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(userData),
  });

  const data = (await response.json()) as Promise<ApiResponse<SignUpFormData>>;
  return data;
}

async function updateUser(
  userData: UpdatedUserData,
  userId: string,
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<User>> {
  const response = (await axiosWithAuth.put(`/api/users/${userId}`, {
    ...userData,
  })) as AxiosResponse<User>;

  return response;
}

async function getUser(
  userId: string,
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<User>> {
  const response = (await axiosWithAuth.get(
    `/api/users/${userId}`
  )) as AxiosResponse<User>;

  return response;
}

async function deleteUser(
  userId: string,
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<User>> {
  const response = (await axiosWithAuth.delete(
    `/api/users/${userId}`
  )) as AxiosResponse<User>;

  return response;
}

async function addToUserWishlist(
  productId: string,
  userId: string,
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<ApiResponse<WishList>>> {
  const response = (await axiosWithAuth.post(`/api/users/${userId}/wishlist`, {
    productId,
  })) as AxiosResponse<ApiResponse<WishList>>;

  return response;
}

async function getUserWishlist(
  userId: string,
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<ApiResponse<WishList>>> {
  const response = (await axiosWithAuth.get(
    `/api/users/${userId}/wishlist`
  )) as AxiosResponse<ApiResponse<WishList>>;

  return response;
}

async function deleteProductFromWishlist(
  productId: string,
  userId: string,
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<ApiResponse<null>>> {
  const response = (await axiosWithAuth.delete(
    `/api/users/${userId}/wishlist/${productId}`
  )) as AxiosResponse<ApiResponse<null>>;

  return response;
}

export const users = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  addToUserWishlist,
  getUserWishlist,
  deleteProductFromWishlist,
};
