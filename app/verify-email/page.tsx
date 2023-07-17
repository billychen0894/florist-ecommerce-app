'use client';

import { verifyJwtAccessToken } from '@lib/jwt';
import { useRouter, useSearchParams } from 'next/navigation';

interface emailTokenResponse {
  status: number;
  message: string;
  data: {
    emailVerifyToken: string;
    emailVerified: Date;
    emailTokenExpired: boolean;
  };
  error: string | null;
}

export default function VerifyEmailPage() {
  const searchParam = useSearchParams();
  const router = useRouter();
  const token = searchParam.get('token');

  const handleVerifyEmail = async (token: string | null) => {
    try {
      // check if token exists
      if (!token) throw new Error('Email verification token is missing');

      const tokenVerifiedResult = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/emailValidation/tokenVerification/${token}`
      );
      const result: emailTokenResponse = await tokenVerifiedResult.json();
      const { data } = result;
      const { emailVerifyToken, emailVerified, emailTokenExpired } = data;

      // TODO: if it's expired, send a new email verification link to the user's email
      if (emailTokenExpired)
        throw new Error('Email verification token has expired');

      if (result?.status === 400)
        throw new Error(`Email verification failed: ${result?.message}`);

      // if successful, update db to set emailVerified_at to current time
      if (result?.status === 200 && emailVerified) {
        const decodedPayload = verifyJwtAccessToken(emailVerifyToken);

        if (!decodedPayload) throw new Error('Invalid token');

        const email: string = decodedPayload?.email;

        const updatedUser = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              emailVerified: new Date(),
            }),
          }
        );

        const updatedUserData = await updatedUser.json();
        if (updatedUserData.status === 401)
          throw new Error(
            `Email verification failed: ${updatedUserData?.message}`
          );

        // if successful, redirect to login page
        if (updatedUserData.status === 201) {
          router.push('/');
        }
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div className="text-center">
        <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
          Please verify your email
        </h1>
        <p className="mt-6 text-base leading-7 text-gray-600">
          Please click to verify your email address. If you did not receive the
          email, please check your spam folder.
        </p>
        <div className="mt-10 flex items-center justify-center gap-x-6">
          <button
            type="button"
            onClick={async () => await handleVerifyEmail(token)}
            className="rounded-md bg-primary-500 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
          >
            Verify Email
          </button>
        </div>
      </div>
    </main>
  );
}
