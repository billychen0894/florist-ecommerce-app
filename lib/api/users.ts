import { SignUpFormData } from '@components/Auth/SignUpForm';
import { ApiResponse, Product, UpdatedUserData, User } from '@lib/types/api';
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
  const response = (await axiosWithAuth.put(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`,
    {
      ...userData,
    }
  )) as AxiosResponse<User>;

  return response;
}

async function getUser(
  userId: string,
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<User>> {
  const response = (await axiosWithAuth.get(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`
  )) as AxiosResponse<User>;

  return response;
}

async function deleteUser(
  userId: string,
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<User>> {
  const response = (await axiosWithAuth.delete(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/${userId}`
  )) as AxiosResponse<User>;

  return response;
}

async function addToWishlist(
  productId: string,
  userId: string,
  axiosWithAuth: AxiosInstance
): Promise<AxiosResponse<ApiResponse<Product>>> {
  const response = (await axiosWithAuth.post(
    `${process.env.NEXT_PUBLIC_API_URL}/api/users/wishlist`,
    {
      userId,
      productId,
    }
  )) as AxiosResponse<ApiResponse<Product>>;

  return response;
}

export const users = {
  createUser,
  getUser,
  updateUser,
  deleteUser,
  addToWishlist,
};
