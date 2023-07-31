import axios from '@lib/axios';
import {
  ApiResponse,
  User,
  VerifyingEmailData,
  VerifyingEmailTokenData,
  sendEmailData,
} from '@lib/types/api';
import { AxiosResponse } from 'axios';

async function sendEmail(
  data: sendEmailData
): Promise<AxiosResponse<ApiResponse<null>>> {
  const response = (await axios.post('/api/email/sendEmail', {
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

async function validateEmail(
  email: string
): Promise<AxiosResponse<ApiResponse<null>>> {
  const response = (await axios.get(
    `/api/email/validation/${email}`
  )) as AxiosResponse<ApiResponse<null>>;

  return response;
}

async function verifyEmailToken(
  emailToken: string
): Promise<AxiosResponse<ApiResponse<VerifyingEmailTokenData>>> {
  const response = (await axios.get(
    `/api/email/tokenVerification/${emailToken}`
  )) as AxiosResponse<ApiResponse<VerifyingEmailTokenData>>;

  return response;
}

export const emails = {
  sendEmail,
  updateVerifyingEmail,
  validateEmail,
  verifyEmailToken,
};
