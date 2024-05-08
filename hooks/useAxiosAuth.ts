'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';

import { axiosWithAuth } from '@/lib/axios';
import useRefreshToken from './useRefreshToken';

export default function useAxiosWithAuth() {
  const { data: session } = useSession();
  const refreshToken = useRefreshToken();

  useEffect(() => {
    // Add a request interceptor to add the access token to the request
    const requestInterceptor = axiosWithAuth.interceptors.request.use(
      (config) => {
        if (!config.headers.Authorization) {
          config.headers.Authorization = `Bearer ${session?.user.accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // Add a response interceptor to refresh the access token if it's expired
    const responseInterceptor = axiosWithAuth.interceptors.response.use(
      (response) => response,
      async (error) => {
        const prevRequest = error.config;
        if (error.response.status === 401 && !prevRequest.sent) {
          prevRequest.sent = true;
          await refreshToken();
          prevRequest.headers.Authorization = `Bearer ${session?.user.accessToken}`;
          return axiosWithAuth(prevRequest);
        }

        return Promise.reject(error);
      }
    );

    // Remove the request & response interceptors on unmount
    return () => {
      axiosWithAuth.interceptors.request.eject(requestInterceptor);
      axiosWithAuth.interceptors.response.eject(responseInterceptor);
    };
  }, [session, refreshToken]);

  return axiosWithAuth;
}
