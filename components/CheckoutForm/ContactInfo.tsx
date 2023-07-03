import { ErrorMessage } from '@hookform/error-message';
import Link from 'next/link';
import { useFormContext } from 'react-hook-form';

import { Input, Label } from '@components/ui';

export default function ContactInfo() {
  const {
    register,
    formState: { errors },
  } = useFormContext();
  return (
    <>
      <div className="sm:flex sm:justify-between sm:items-center">
        <h2 className="text-lg font-medium text-gray-900">
          Contact information
        </h2>
        <span className="text-xs sm:text-sm">
          Already have an account?{' '}
          <Link href="/sign-in" className="text-blue-500 hover:text-blue-400">
            Sign in
          </Link>
        </span>
      </div>
      <div className="mt-4">
        <Label htmlFor="contactEmail">Email address</Label>
        <div className="mt-1">
          <Input
            id="contactEmail"
            type="email"
            autoComplete="email"
            {...register('contactEmail')}
          />
        </div>
        <ErrorMessage
          errors={errors}
          name="contactEmail"
          as="p"
          className="text-sm font-medium text-red-500 mt-1 ml-1"
        />
      </div>
    </>
  );
}
