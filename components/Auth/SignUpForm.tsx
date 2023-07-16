'use client';

import { Input, Label } from '@components/ui';
import { FaceFrownIcon, FaceSmileIcon } from '@heroicons/react/20/solid';
import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { debounce } from 'lodash';
import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';

import Modal from '@components/ui/Modal';
import { asyncCacheTest } from '@lib/asyncCacheTest';
import { cn } from '@lib/classNames';

// Override default email regex
yup.addMethod(yup.string, 'email', function validateEmail(message) {
  return this.matches(/^[^\s@]+@[^\s@]+\.[^\s@]+$/, {
    message,
    excludeEmptyString: true,
  });
});

// If the email validation result same as the previous one, return the previous result instead of calling the API again
const actualValidityTest = asyncCacheTest(
  (value: string) =>
    new Promise((resolve) => {
      const result = fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/emailValidation/${value}`
      ).then((res) => {
        if (res.status === 200) {
          resolve(true);
        } else {
          resolve(false);
        }
      });
      return result;
    })
);

export const signUpFormSchema = yup.object().shape({
  firstName: yup
    .string()
    .required('Your first name is required')
    .max(50, 'Your first name is too long'),
  lastName: yup
    .string()
    .required('Your last name is required')
    .max(50, 'Your last name is too long'),
  // If the email validation fails inside the test method, it will throw validationError, which prevents calling the API in every keystroke
  // source from this github issue: https://github.com/jquense/yup/issues/256
  email: yup
    .string()
    .email('Invalid email address')
    .required('Your email is required')
    .test('unique-email', 'This email is already registered', async (value) => {
      await yup
        .object({
          email: yup
            .string()
            .email('Invalid email address')
            .required('Your email is required'),
        })
        .validate({ email: value });

      const result = await actualValidityTest(value);

      return result as boolean;
    }),
  // password must contain at least 8 characters, at least one uppercase letter, one lowercase letter, one number
  password: yup
    .string()
    .required('Your password is required')
    .min(8, 'Password must be at least 8 characters long')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/,
      'Password must contain at least one uppercase and lowercase letter, and one number'
    ),
  // confirm password must match password
  confirmPassword: yup
    .string()
    .required('Please confirm your password')
    .test('passwords-match', 'Passwords must match', function (value) {
      return this.parent.password === value;
    }),
});

export type SignUpFormData = yup.InferType<typeof signUpFormSchema>;

function SignUpForm() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isAccountCreated, setIsAccountCreated] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignUpFormData>({
    resolver: yupResolver(signUpFormSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onChange',
  });

  const onSubmit = async (data: SignUpFormData) => {
    try {
      setIsAccountCreated(false);
      const userRegisteredResult = await fetch(
        `${process.env.NEXT_PUBLIC_API_URL}/api/users`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data),
        }
      );

      // throw error with status code and message in the request response
      if (!userRegisteredResult.ok) {
        setIsAccountCreated(false);
        setModalOpen(true);
        throw new Error(userRegisteredResult.statusText);
      }

      // SignIn the user after successful registration
      const userSignInResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (userSignInResult && !userSignInResult.ok) {
        setIsAccountCreated(false);
        setModalOpen(true);
        throw new Error(userSignInResult.error || 'Something went wrong!');
      }

      const user = await userRegisteredResult.json();
      setIsAccountCreated(true);
      setModalOpen(true);
      return user;
    } catch (error) {
      setIsAccountCreated(false);
      setModalOpen(true);
      console.error(error);
    }
  };

  // Desctructure the register method to register the email input field to be debounced in order
  // to prevent extra api calls when the email is valid but the user is still typing.
  // Reasoning: if the debounce is implemented directly in the yup schema, it will make a weird behaviour for the error message of the email input
  // , which will be displayed only the previous validation error message, not the current one.
  // Also, when other input fields are entered, the async api call will be sent again, which is not necessary.
  // Becasue the yup schema makes the form validation as a whole asynchoronously, instead of field by field.
  const {
    ref: emailRef,
    onChange: emailOnChange,
    onBlur: emailOnBlur,
    name: emailName,
  } = register('email');

  return (
    <>
      {isAccountCreated ? (
        <Modal
          open={modalOpen}
          setOpen={setModalOpen}
          title="Account registration successful"
          description="You have successfully registered your account. Please check your email to verify your account."
          buttonText="Go to homepage"
          svgIcon={
            <FaceSmileIcon
              className="h-6 w-6 text-green-600"
              aria-hidden="true"
            />
          }
          buttonAction={() => router.push('/')}
        />
      ) : (
        <Modal
          open={modalOpen}
          setOpen={setModalOpen}
          title="Account registration failed"
          description="Something went wrong, please try again later."
          buttonText="Close"
          svgIcon={
            <FaceFrownIcon
              className="h-6 w-6 text-red-600"
              aria-hidden="true"
            />
          }
          iconBgColor="bg-red-100"
        />
      )}

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
              name={emailName}
              ref={emailRef}
              onChange={debounce(emailOnChange, 1000)}
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
            className={cn(
              'flex w-full justify-center rounded-md bg-primary-500 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500 cursor-pointer',
              {
                'opacity-50 cursor-not-allowed': isSubmitting || !isValid,
              }
            )}
            disabled={isSubmitting || !isValid}
          >
            Create Account
          </button>
        </div>
      </form>
    </>
  );
}

export default SignUpForm;
