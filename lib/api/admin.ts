import { ApiResponse, User } from '@lib/types/api';
import { AxiosInstance } from 'axios';

async function getAllUsers(
  axiosWithAuth: AxiosInstance
): Promise<ApiResponse<User[]>> {
  const response = (await axiosWithAuth.get('/api/admin/users')) as ApiResponse<
    User[]
  >;

  return response;
}

export const admin = {
  getAllUsers,
};
