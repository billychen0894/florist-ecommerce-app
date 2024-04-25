'use client';

import { ErrorMessage } from '@hookform/error-message';
import { useForm } from 'react-hook-form';
import { Input, Label } from '@components/ui';
import Button from '@components/ui/Button';
import Spinner from '@components/ui/Spinner';
import {
  ForgotPasswordFormSchema,
  forgotPasswordFormSchema,
} from '@lib/schemaValidator';
import { zodResolver } from '@hookform/resolvers/zod';
import { onSubmitForgotPasswordForm } from '@lib/formActions';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

function ForgotPassword() {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordFormSchema>({
    resolver: zodResolver(forgotPasswordFormSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onBlur',
  });

  const {
    ref: emailRef,
    onBlur: emailOnBlur,
    name: emailName,
  } = register('email');

  const onSubmit = async (data: ForgotPasswordFormSchema) => {
    try {
      const formData = new FormData();
      formData.append('email', data.email);

      const result = await onSubmitForgotPasswordForm(formData);

      if (!result?.success) {
        setError('email', {
          type: 'custom',
          message: result?.message || 'Something went wrong',
        });
      } else {
        toast.success('Reset password email has been sent successfully!');
        router.push('/auth/signin');
      }
    } catch (err: any) {
      console.log('Error: ', err.message);
      setError('email', {
        type: 'custom',
        message: 'Something went wrong',
      });
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
            <span className="inline-block">Continue</span>
          </div>
        </Button>
      </div>
    </form>
  );
}

export default ForgotPassword;
