'use client';

import { FaceFrownIcon, FaceSmileIcon } from '@heroicons/react/20/solid';
import { ErrorMessage } from '@hookform/error-message';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import { zodResolver } from '@hookform/resolvers/zod';
import { Input, Label } from '@components/ui';
import Button from '@components/ui/Button';
import Modal from '@components/ui/Modal';
import { cn } from '@lib/classNames';
import Spinner from '@components/ui/Spinner';
import { SignUpFormSchema, signUpFormSchema } from '@lib/schemaValidator';
import { onSubmitSignUpForm } from '@lib/formActions';
import { signIn } from 'next-auth/react';
import { debounce } from 'lodash';
import { checkEmailIfExists } from '@lib/checkEmailIfExists';

export default function SignUpForm() {
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isAccountCreated, setIsAccountCreated] = useState<boolean>(false);
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<SignUpFormSchema>({
    resolver: zodResolver(
      signUpFormSchema.refine(
        async (data) => {
          const emailExists = await checkEmailIfExists(data.email);
          return !emailExists;
        },
        { message: 'Email already exists', path: ['email'] }
      )
    ),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
    mode: 'onBlur',
  });

  const onSubmit = async (data: SignUpFormSchema) => {
    const formData = new FormData();
    formData.append('firstName', data.firstName);
    formData.append('lastName', data.lastName);
    formData.append('email', data.email);
    formData.append('password', data.password);
    formData.append('confirmPassword', data.confirmPassword);

    try {
      toast.loading('Creating your account...');
      const result = await onSubmitSignUpForm(formData);

      if (!result.success) {
        toast.dismiss();
        setModalOpen(true);
        throw new Error(result.message || 'Something went wrong!');
      }

      const userSignInResult = await signIn('credentials', {
        redirect: false,
        email: data.email,
        password: data.password,
      });

      if (userSignInResult && !userSignInResult.ok) {
        toast.dismiss();
        setModalOpen(true);
        throw new Error(userSignInResult.error || 'Something went wrong!');
      }

      toast.dismiss();
      setIsAccountCreated(true);
      setModalOpen(true);
    } catch (error) {
      console.error(error);
      toast.dismiss();
      setModalOpen(true);
    }
  };

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
          backdropAction={() => router.push('/')}
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
              onChange={async () => {
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
          <Button
            type="submit"
            className={cn(
              'flex w-full justify-center px-3 py-1.5 leading-6 cursor-pointer',
              {
                'opacity-50 cursor-not-allowed': isSubmitting || !isValid,
              }
            )}
            disabled={isSubmitting || !isValid}
          >
            <div className="flex justify-center items-center">
              {isSubmitting && <Spinner />}
              <span className="inline-block">Create Account</span>
            </div>
          </Button>
        </div>
      </form>
    </>
  );
}
