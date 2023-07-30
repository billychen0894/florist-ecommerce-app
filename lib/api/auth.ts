import axios from '@lib/axios';
import { AxiosResponse } from 'axios';

import { SignInApiResponse } from '@lib/types/api';

async function signIn(
  credentials: Record<'password' | 'email', string> | undefined
) {
  const response = (await axios.post('/api/signin', {
    ...credentials,
  })) as AxiosResponse<SignInApiResponse>;

  return response;
}

export const auth = {
  signIn,
};
