'use client';

import { CheckIcon, FaceFrownIcon } from '@heroicons/react/20/solid';
import { useRouter, useSearchParams } from 'next/navigation';
import { useState } from 'react';
import toast from 'react-hot-toast';

import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import { sendNewEmailVerificationLink } from '@lib/sendNewEmailVerificationLink';

interface emailTokenResponse {
  status: number;
  message: string;
  data: {
    email: string;
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
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [emailVerificationToken, setEmailVerificationToken] = useState<
    string | null
  >(null);
  const [isEmailVerified, setIsEmailVerified] = useState<boolean>(false);
  const [ErrorMessage, setErrorMessage] = useState<string>('');

  const handleVerifyEmail = async (token: string | null) => {
    try {
      if (!token) throw new Error('Email verification token is missing');

      const tokenVerifiedResult = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/emailValidation/tokenVerification/${token}`
      );
      const result: emailTokenResponse = await tokenVerifiedResult.json();
      const { data } = result;
      const { email, emailVerifyToken, emailVerified, emailTokenExpired } =
        data;

      if (emailVerifyToken) setEmailVerificationToken(emailVerifyToken);

      if (emailTokenExpired) {
        setModalOpen(true);
        setIsEmailVerified(false);
        setErrorMessage('Email verification token has expired');
        throw new Error('Email verification token has expired');
      }

      if (result?.status === 400) {
        setModalOpen(true);
        setIsEmailVerified(false);
        setErrorMessage(result?.message);
        throw new Error(`Email verification failed: ${result?.message}`);
      }

      if (result?.status === 200 && emailVerified) {
        const updatedUser = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/api/email`,
          {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: email,
              emailVerified: new Date(),
              emailVerifyToken: token,
            }),
          }
        );

        const updatedUserData = await updatedUser.json();

        if (updatedUserData.status === 401) {
          setModalOpen(true);
          setIsEmailVerified(false);
          setErrorMessage(updatedUserData?.message);
          throw new Error(
            `Email verification failed: ${updatedUserData?.message}`
          );
        }

        if (updatedUserData.status === 201) {
          setModalOpen(true);
          setIsEmailVerified(true);
        }
      }
    } catch (error) {
      setModalOpen(true);
      setIsEmailVerified(false);
      console.error(error);
    }
  };

  const handleSendNewEmailVerificationLink = async (
    emailVerificationToken: string | null,
    setEmailVerificationToken: (token: string) => void
  ) => {
    // when it's clicked, send a new email verification link to the user's email
    toast.promise(
      sendNewEmailVerificationLink({
        emailVerificationToken,
        setEmailVerificationToken,
      }),
      {
        loading: 'Sending new email verification link...',
        success: 'New email verification link sent!',
        error: 'Failed to send new email verification link, please try again.',
      }
    );
  };

  return (
    <>
      {isEmailVerified ? (
        <Modal
          open={modalOpen}
          setOpen={setModalOpen}
          title="Email verified!"
          description="Your email has been verified successfully. You can now login to your account."
          buttonText="Go to homepage"
          svgIcon={
            <CheckIcon className="h-6 w-6 text-green-600" aria-hidden="true" />
          }
          buttonAction={() => router.push('/')}
          backdropAction={() => router.push('/')}
        />
      ) : (
        <Modal
          open={modalOpen}
          setOpen={setModalOpen}
          title={ErrorMessage || 'Email verification failed'}
          description="Please click the button below to send a new email verification link to your email address."
          buttonText={
            ErrorMessage === 'Email is already verified'
              ? 'Go to homepage'
              : 'Send new email verification link'
          }
          svgIcon={
            <FaceFrownIcon
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          }
          iconBgColor="bg-red-100"
          buttonAction={
            ErrorMessage === 'Email is already verified'
              ? () => {
                  router.push('/');
                }
              : () => {
                  handleSendNewEmailVerificationLink(
                    emailVerificationToken,
                    setEmailVerificationToken
                  );
                }
          }
        />
      )}
      <main className="grid min-h-full place-items-center bg-white px-6 py-24 sm:py-32 lg:px-8">
        <div className="text-center">
          <h1 className="mt-4 text-3xl font-bold tracking-tight text-gray-900 sm:text-5xl">
            Please verify your email
          </h1>
          <p className="mt-6 text-base leading-7 text-gray-600">
            Please click to verify your email address. If you did not receive
            the email, please check your spam folder.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button
              type="button"
              onClick={async () => await handleVerifyEmail(token)}
            >
              Verify Email
            </Button>
          </div>
        </div>
      </main>
    </>
  );
}
