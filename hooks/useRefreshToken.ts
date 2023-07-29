'use client';

import axios from '@lib/axios';
import { useSession } from 'next-auth/react';

export default function useRefreshToken() {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const response = await axios.post(
      `${process.env.NEXT_PUBLIC_API_URL}/api/refreshAccessToken`,
      {
        refreshToken: session?.user.refreshToken,
      }
    );

    if (session) session.user.accessToken = response?.data.accessToken;
  };

  return refreshToken;
}
