'use client';

import { Input, Label } from '@components/ui';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

const signInFormSchema = z
  .object({
    email: z
      .string()
      .email({ message: 'Invalid email address' })
      .or(z.literal('')),
    // password must contain at least 8 characters, at least one uppercase letter, one lowercase letter, one number
    password: z
      .string()
      .min(8, { message: 'Password must be at least 8 characters long' })
      .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/, {
        message:
          'Password must contain at least one uppercase and lowercase letter, and one number',
      })
      .or(z.literal('')),
    rememberMe: z.boolean().optional(),
  })
  .superRefine((data, ctx) => {
    if (data.email === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['email'],
        message: 'Email address is required',
      });
    }
    if (data.password === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['password'],
        message: 'Password is required',
      });
    }
  });

export type SignInFormData = z.infer<typeof signInFormSchema>;

function SignInForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignInFormData>({
    resolver: zodResolver(signInFormSchema),
    defaultValues: {
      email: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: SignInFormData) => {
    await signIn('credentials', {
      email: data.email,
      password: data.password,
      rememberMe: data.rememberMe,
      redirect: true,
      callbackUrl: '/',
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
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-primary-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          Sign in
        </button>
      </div>
    </form>
  );
}

export default SignInForm;
