'use client';

import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

import { stringRequired } from '@components/CheckoutForm/formValidator';
import { Input, Label } from '@components/ui';

const signUpFormSchema = z
  .object({
    firstName: stringRequired('Your first name is required').max(50, {
      message: 'Your first name is too long',
    }),
    lastName: stringRequired('Your last name is required').max(50, {
      message: 'Your last name is too long',
    }),
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
    // confirm password must match password
    confirmPassword: z.string().or(z.literal('')),
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
    if (data.confirmPassword === '') {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Confirm password is required',
      });
    }
    if (data.password !== data.confirmPassword) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        path: ['confirmPassword'],
        message: 'Passwords must match',
      });
    }
  });

export type SignUpFormData = z.infer<typeof signUpFormSchema>;

function SignUpForm() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignUpFormData>({
    resolver: zodResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/users`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!res.ok) {
        throw {
          status: res.status,
          message: 'Something went wrong',
        };
      }

      const user = await res.json();
      return user;
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
      <div>
        <Label htmlFor="firstName" className="leading-6 text-gray-900">
          First name
        </Label>
        <div className="mt-2">
          <Input
            id="firstName"
            type="text"
            autoComplete="given-name"
            {...register('firstName')}
            className="border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
          />
        </div>
        <ErrorMessage
          errors={errors}
          name="firstName"
          as="p"
          className="text-sm font-medium text-red-500 mt-1 ml-1"
        />
      </div>
      <div>
        <Label htmlFor="lastName" className="leading-6 text-gray-900">
          Last name
        </Label>
        <div className="mt-2">
          <Input
            id="lastName"
            type="text"
            autoComplete="family-name"
            {...register('lastName')}
            className="border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
          />
        </div>
        <ErrorMessage
          errors={errors}
          name="lastName"
          as="p"
          className="text-sm font-medium text-red-500 mt-1 ml-1"
        />
      </div>
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

      <div>
        <Label htmlFor="confirmPassword" className="leading-6 text-gray-900">
          Confirm password
        </Label>
        <div className="mt-2">
          <Input
            id="confirmPassword"
            type="password"
            autoComplete="current-password"
            {...register('confirmPassword')}
            className="border-0 py-1.5 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset sm:leading-6"
          />
        </div>
        <ErrorMessage
          errors={errors}
          name="confirmPassword"
          as="p"
          className="text-sm font-medium text-red-500 mt-1 ml-1"
        />
      </div>

      <div>
        <button
          type="submit"
          className="flex w-full justify-center rounded-md bg-primary-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
        >
          Create Account
        </button>
      </div>
    </form>
  );
}

export default SignUpForm;
