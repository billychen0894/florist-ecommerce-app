import axios from '@/lib/axios';
import { AxiosResponse } from 'axios';

import { RefreshAccessTokenResponse, SignInApiResponse } from '@/lib/types/api';

async function signIn(
  credentials: Record<'password' | 'email', string> | undefined
) {
  const response = (await axios.post('/api/signin', {
    ...credentials,
  })) as AxiosResponse<SignInApiResponse>;

  return response;
}

async function refreshAccessToken(
  refreshToken: string
): Promise<AxiosResponse<RefreshAccessTokenResponse>> {
  const response = (await axios.post('/api/refreshAccessToken', {
    refreshToken,
  })) as AxiosResponse<RefreshAccessTokenResponse>;

  return response;
}

export const auth = {
  signIn,
  refreshAccessToken,
};
