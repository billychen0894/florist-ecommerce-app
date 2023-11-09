'use client';

import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { asyncCacheTest } from '@lib/asyncCacheTest';
import * as yup from 'yup';
import * as jwt from 'jsonwebtoken';
import { JwtPayload } from 'jsonwebtoken';
import dynamic from 'next/dynamic';

import { Input, Label } from '@components/ui';
import Button from '@components/ui/Button';
import { fetchUserByEmail } from '@actions/fetchUserByEmail';
import Spinner from '@components/ui/Spinner';
import { validateTokenWithUserEmail } from '@actions/validateResetPasswordToken';
import { useRouter, useSearchParams } from 'next/navigation';
import { updateUserPasswordByEmail } from '@actions/updateUserByEmail';
import toast from 'react-hot-toast';
import { useEffect, useState } from 'react';
import { verifyJwtAccessToken } from '@lib/jwt';
import { FaceFrownIcon } from '@node_modules/@heroicons/react/20/solid';
import { sendForgotPasswordEmail } from '@actions/sendForgotPasswordEmail';

// Override default email regex
yup.addMethod(yup.string, 'email', function validateEmail(message) {
  return this.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message,
    excludeEmptyString: true,
  });
});

const checkEmailIfExists = asyncCacheTest(
  (value: string) =>
    new Promise((resolve) => {
      fetchUserByEmail(value)
        .then((res) => {
          if (res) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          console.error('Error while validating email:', error);
          resolve(false);
        });
    })
);

const resetFormSchema = yup.object().shape({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Your email is required')
    .test('unique-email', 'This email is not registered', async (value) => {
      await yup
        .object({
          email: yup
            .string()
            .email('Invalid email address')
            .required('Your email is required'),
        })
        .validate({ email: value });

      const result = await checkEmailIfExists(value);

      return result as boolean;
    }),
  newPassword: yup
    .string()
    .required('Your new password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      'Password must contain at least one uppercase and lowercase letter, and one number'
    ),
  confirmNewPassword: yup
    .string()
    .required('Please confirm your new password')
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.newPassword === value;
    }),
});

export type ResetFormData = yup.InferType<typeof resetFormSchema>;

function ResetForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ResetFormData>({
    resolver: yupResolver(resetFormSchema),
    defaultValues: {
      email: '',
      newPassword: '',
      confirmNewPassword: '',
    },
    mode: 'onChange',
  });
  const token = useSearchParams().get('token');
  const [isTokenExpired, setIsTokenExpired] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const router = useRouter();
  const Modal = dynamic(() => import('@components/ui/Modal'));

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

  // For some reason, yup test api does not work with error message react-form-hook
  // this is a workaround to register input explicitly
  const {
    ref: emailRef,
    onChange: emailOnChange,
    onBlur: emailOnBlur,
    name: emailName,
  } = register('email');

  const onSubmit = async (data: ResetFormData) => {
    try {
      const { email, newPassword, confirmNewPassword } = data;
      if (!token) {
        throw new Error('No token supplied');
      }

      if (newPassword !== confirmNewPassword) {
        throw new Error('passwords do not match');
      }

      const validationResult = await validateTokenWithUserEmail(email, token);

      if (!validationResult) {
        throw new Error('Token validation failed');
      }

      const updateResult = await updateUserPasswordByEmail(email, newPassword);

      const { toast } = await import('react-hot-toast');
      if (updateResult) {
        toast.success('Successfully reset your password');
        router.push('/');
      } else {
        throw new Error('Something went wrong during user update');
      }
    } catch (err: any) {
      console.log('Error: ', err.message);
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
              onChange={async () => {
                const { debounce } = await import('lodash');
                debounce(emailOnChange, 1000);
              }}
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
