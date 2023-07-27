'use client';

import { useSession } from 'next-auth/react';

export default function useRefreshToken() {
  const { data: session } = useSession();

  const refreshToken = async () => {
    const response = await fetch(
      `${process.env.NEXTAUTH_URL}/api/auth/refresh-token`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          refreshToken: session?.user.refreshToken,
        }),
      }
    );

    const data = await response.json();

    if (session) session.user.accessToken = data.accessToken;
  };

  return refreshToken;
}
