'use client';

import { useSession } from 'next-auth/react';

import { auth } from '@lib/api/auth';

export default function useRefreshToken() {
  const { data: session, update } = useSession();

  const refreshToken = async () => {
    const response = await auth.refreshAccessToken(session?.user.refreshToken);

    if (session) {
      session.user.accessToken = response?.data.accessToken;
      update({ accessToken: response?.data.accessToken });
    }
  };

  return refreshToken;
}
