import { Input } from '@components/ui';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { UseFormReturn } from 'react-hook-form';

import { type FormData } from './CheckoutForm';

interface ContactInfoProps {
  form: UseFormReturn<FormData>;
}

export default function ContactInfo({ form }: ContactInfoProps) {
  return (
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
  );
}
