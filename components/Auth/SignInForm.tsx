'use client';

import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input, Label } from '@components/ui';
import Button from '@components/ui/Button';
import Spinner from '@components/ui/Spinner';

// Override default email regex
yup.addMethod(yup.string, 'email', function validateEmail(message) {
  return this.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message,
    excludeEmptyString: true,
  });
});

const signInFormSchema = yup.object({
  email: yup
    .string()
    .email('Invalid email address')
    .required('Email is required'),
  // password must contain at least 8 characters, at least one uppercase letter, one lowercase letter, one number
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      'Password must contain at least one uppercase and lowercase letter, and one number'
    )
    .required('Password is required'),
});

export type SignInFormData = yup.InferType<typeof signInFormSchema>;

function SignInForm() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    setError,
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });
  const callbackUrlEncoded = useSearchParams().get('callbackUrl');
  const callbackUrl = callbackUrlEncoded
    ? decodeURIComponent(callbackUrlEncoded)
    : '/';

  const onSubmit = async (data: SignInFormData) => {
    try {
      const signInRes = await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: false,
        callbackUrl: callbackUrl,
      });

      if (signInRes?.url) {
        const url = new URL(signInRes.url);
        const path = url.pathname;
        router.push(path);
      } else {
        console.log('SingIn credential failed: ', signInRes?.error);
        setError('password', {
          message: 'Incorrect password. Please try again.',
        });
      }
    } catch (err: any) {
      console.log('Error: ', err.message);
    }
  };

  return (
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
            {...register('email')}
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
          Password
        </Label>
        <div className="mt-2">
          <Input
            id="password"
            type="password"
            autoComplete="current-password"
            {...register('password')}
            className="border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
          />
        </div>
        <ErrorMessage
          errors={errors}
          name="password"
          as="p"
          className="text-sm font-medium text-red-500 mt-1 ml-1"
        />
      </div>

      <div className="flex items-center justify-end">
        <div className="text-sm leading-6">
          <Link
            href="/auth/forgot-password"
            className="font-semibold text-primary-500 hover:text-primary-400"
          >
            Forgot password?
          </Link>
        </div>
      </div>

      <div>
        <Button
          type="submit"
          className="flex w-full justify-center px-3 py-1.5 leading-6"
        >
          <div className="flex justify-center items-center">
            {isSubmitting && <Spinner />}
            <span className="inline-block">Sign in</span>
          </div>
        </Button>
      </div>
    </form>
  );
}

export default SignInForm;
