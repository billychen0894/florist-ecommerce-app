import { Input } from '@components/ui';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { UseFormReturn } from 'react-hook-form';

import Link from 'next/link';
import { type FormData } from './CheckoutForm';

interface ContactInfoProps {
  form: UseFormReturn<FormData>;
}

export default function ContactInfo({ form }: ContactInfoProps) {
  return (
    <>
      <div className="sm:flex sm:justify-between sm:items-center">
        <h2 className="text-lg font-medium text-gray-900">
          Contact information
        </h2>
        <span className="text-xs sm:text-sm">
          Already have an account?{' '}
          <Link href="/signin" className="text-blue-500 hover:text-blue-400">
            Sign in
          </Link>
        </span>
      </div>
      <div className="mt-4">
        <FormField
          control={form.control}
          name="contactEmail"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Email address</FormLabel>
              <FormControl className="mt-1">
                <Input {...field} type="email" autoComplete="email" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </>
  );
}
