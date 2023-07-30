import axios from '@lib/axios';
import {
  ApiResponse,
  User,
  VerifyingEmailData,
  sendEmailData,
} from '@lib/types/api';
import { AxiosResponse } from 'axios';

async function sendEmail(
  data: sendEmailData
): Promise<AxiosResponse<ApiResponse<null>>> {
  const response = (await axios.post('/api/sendEmail', {
    ...data,
  })) as AxiosResponse<ApiResponse<null>>;

  return response;
}

async function updateVerifyingEmail(
  data: VerifyingEmailData
): Promise<AxiosResponse<ApiResponse<User>>> {
  const response = (await axios.put('/api/email', {
    ...data,
  })) as AxiosResponse<ApiResponse<User>>;

  return response;
}

export const emails = {
  sendEmail,
  updateVerifyingEmail,
};
