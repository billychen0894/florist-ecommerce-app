'use client';

import { ErrorMessage } from '@hookform/error-message';
import { useForm } from 'react-hook-form';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import { Input, Label } from '@components/ui';
import Button from '@components/ui/Button';
import Spinner from '@components/ui/Spinner';
import { redirect, useRouter, useSearchParams } from 'next/navigation';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { verifyJwtAccessToken } from '@lib/jwt';
import { FaceFrownIcon } from '@node_modules/@heroicons/react/20/solid';
import { sendForgotPasswordEmail } from '@actions/sendForgotPasswordEmail';
import { ResetFormSchema, resetFormSchema } from '@lib/schemaValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import Modal from '@components/ui/Modal';
import { onSubmitResetPassword } from '@lib/formActions';

function ResetForm() {
  const token = useSearchParams().get('token');
  if (!token) {
    redirect('/');
  }
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetFormSchema>({
    resolver: zodResolver(resetFormSchema),
    defaultValues: {
      email: '',
      newPassword: '',
      confirmNewPassword: '',
      token: token || '',
    },
    mode: 'onBlur',
  });
  const [isTokenExpired, setIsTokenExpired] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();

  useEffect(() => {
    if (token && token !== '') {
      const payload = verifyJwtAccessToken(token) as JwtPayload;

      if (payload.name === 'TokenExpiredError') {
        setIsTokenExpired(true);
        setIsModalOpen(true);
      } else {
        setIsTokenExpired(false);
        setIsModalOpen(false);
      }
    }
  }, [token]);

  const {
    ref: emailRef,
    onBlur: emailOnBlur,
    name: emailName,
  } = register('email');

  const onSubmit = async (data: ResetFormSchema) => {
    try {
      if (!token) {
        toast.error('Invalid reset email link. Please request a new one');
        throw new Error('No token supplied');
      }

      const formData = new FormData();
      formData.append('email', data.email);
      formData.append('newPassword', data.newPassword);
      formData.append('confirmNewPassword', data.confirmNewPassword);
      formData.append('token', token);

      const result = await onSubmitResetPassword(formData);

      if (result?.success) {
        toast.success('Successfully reset your password');
        router.push('/');
      } else {
        toast.error(
          result?.message || 'Something went wrong during reset your password'
        );
      }
    } catch (err: any) {
      console.error('Error: ', err.message);
      toast.error('Something went wrong during reset your password');
    }
  };

  return (
    <>
      {isTokenExpired && (
        <Modal
          open={isModalOpen}
          setOpen={setIsModalOpen}
          title="Password reset link expired"
          description="Please click the button below to send a new reset password link to your email address."
          buttonText="Send new reset password link"
          svgIcon={
            <FaceFrownIcon
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          }
          iconBgColor="bg-red-100"
          buttonAction={async () => {
            const { toast } = await import('react-hot-toast');
            const loadingToastId = toast.loading(
              'Sending new reset password link.'
            );
            if (token) {
              const decodedToken = jwt.decode(token) as JwtPayload;
              const result = await sendForgotPasswordEmail(decodedToken?.email);

              if (result) {
                toast.dismiss(loadingToastId);
                toast.success('New reset password link is sent successfully');
              } else {
                toast.dismiss(loadingToastId);
                toast.error(
                  'Something went wrong during send new reset password link.'
                );
              }
            }
          }}
        />
      )}
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <div>
          <Label htmlFor="email" className="leading-6 text-gray-900">
            Email address
          </Label>
          <div className="mt-2">
            <Input
              id="email"
              type="email"
              autoComplete="email"
              name={emailName}
              ref={emailRef}
              onBlur={emailOnBlur}
              className="border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="email"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>

        <div>
          <Label htmlFor="password" className="leading-6 text-gray-900">
            New password
          </Label>
          <div className="mt-2">
            <Input
              id="newPassword"
              type="password"
              autoComplete="current-password"
              {...register('newPassword')}
              className="border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="newPassword"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>

        <div>
          <Label htmlFor="confirmPassword" className="leading-6 text-gray-900">
            Confirm new password
          </Label>
          <div className="mt-2">
            <Input
              id="confirmNewPassword"
              type="password"
              autoComplete="current-password"
              {...register('confirmNewPassword')}
              className="border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="confirmNewPassword"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>
        <div>
          <Button
            type="submit"
            className={`${
              !isValid || isSubmitting
                ? 'cursor-not-allowed bg-gray-300 text-gray-100 hover:bg-gray-200'
                : ''
            }flex w-full justify-center px-3 py-1.5 leading-6`}
            disabled={!isValid || isSubmitting}
          >
            <div className="flex justify-center items-center">
              {isSubmitting && <Spinner />}
              <span className="inline-block">Reset password</span>
            </div>
          </Button>
        </div>
      </form>
    </>
  );
}

export default ResetForm;
