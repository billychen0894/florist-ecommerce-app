'use client';

import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import { Input, Label } from '@components/ui';
import Button from '@components/ui/Button';

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
  rememberMe: yup.boolean().defined(),
});

export type SignInFormData = yup.InferType<typeof signInFormSchema>;

function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: yupResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });
  const callbackUrlEncoded = useSearchParams().get('callbackUrl');
  const callbackUrl = callbackUrlEncoded
    ? decodeURIComponent(callbackUrlEncoded)
    : '/';

  const onSubmit = async (data: SignInFormData) => {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
      redirect: true,
      callbackUrl: callbackUrl,
    });
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

      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <Input
            id="rememberMe"
            type="checkbox"
            {...register('rememberMe')}
            className="h-4 w-4 rounded border-gray-300 text-primary-500 focus:ring-primary-500"
          />
          <Label
            htmlFor="rememberMe"
            className="ml-3 block text-sm leading-6 text-gray-900"
          >
            Remember Me
          </Label>
        </div>

        <div className="text-sm leading-6">
          <Link
            href="/forgot-password"
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
          Sign in
        </Button>
      </div>
    </form>
  );
}

export default SignInForm;
