'use client';

import { ErrorMessage } from '@hookform/error-message';
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { asyncCacheTest } from '@lib/asyncCacheTest';
import * as yup from 'yup';

import { Input, Label } from '@components/ui';
import Button from '@components/ui/Button';
import { sendForgotPasswordEmail } from '@actions/sendForgotPasswordEmail';
import { fetchUserByEmail } from '@actions/fetchUserByEmail';
import Spinner from '@components/ui/Spinner';

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

const forgotPasswordSchema = yup.object().shape({
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
});

export type ForgotPasswordData = yup.InferType<typeof forgotPasswordSchema>;

function ForgotPassword() {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid, isSubmitting },
  } = useForm<ForgotPasswordData>({
    resolver: yupResolver(forgotPasswordSchema),
    defaultValues: {
      email: '',
    },
    mode: 'onChange',
  });

  // For some reason, yup test api does not work with error message react-form-hook
  // this is a workaround to register input explicitly
  const {
    ref: emailRef,
    onChange: emailOnChange,
    onBlur: emailOnBlur,
    name: emailName,
  } = register('email');

  const onSubmit = async (data: ForgotPasswordData) => {
    try {
      const { toast } = await import('react-hot-toast');
      const result = await sendForgotPasswordEmail(data.email);

      if (result) {
        toast.success('Reset password email has been sent successfully!');
      } else {
        console.log('result', result);
        toast.error('Something went wrong. Please try again later.');
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
