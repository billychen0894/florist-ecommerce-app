import { UseFormReturn } from 'react-hook-form';

import { Input, Select } from '@components/ui';
import { SelectOption } from '@components/ui/Select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { type FormData } from './CheckoutForm';

interface ShippingInfoProps {
  form: UseFormReturn<FormData>;
}

export default function ShippingInfo({ form }: ShippingInfoProps) {
  return (
    <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
      <div>
        <FormField
          control={form.control}
          name="shippingFirstName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>First name</FormLabel>
              <FormControl className="mt-1">
                <Input {...field} type="text" autoComplete="given-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={form.control}
          name="shippingLastName"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Last name</FormLabel>
              <FormControl className="mt-1">
                <Input {...field} type="text" autoComplete="family-name" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-2">
        <FormField
          control={form.control}
          name="shippingCompany"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Company</FormLabel>
              <FormControl className="mt-1">
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-2">
        <FormField
          control={form.control}
          name="shippingAddressLine1"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Address</FormLabel>
              <FormControl className="mt-1">
                <Input {...field} type="text" autoComplete="street-address" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-2">
        <FormField
          control={form.control}
          name="shippingAddressLine2"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Apartment, suite, etc.</FormLabel>
              <FormControl className="mt-1">
                <Input {...field} type="text" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={form.control}
          name="shippingCity"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>City</FormLabel>
              <FormControl className="mt-1">
                <Input {...field} type="text" autoComplete="address-level2" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={form.control}
          name="shippingCountry"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Country</FormLabel>
              <FormControl className="mt-1">
                <Select {...field}>
                  <SelectOption value="US">United States</SelectOption>
                  <SelectOption value="CA">Canada</SelectOption>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={form.control}
          name="shippingArea"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>State / Province</FormLabel>
              <FormControl className="mt-1">
                <Input {...field} type="text" autoComplete="address-level1" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div>
        <FormField
          control={form.control}
          name="shippingPostalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Postal code</FormLabel>
              <FormControl className="mt-1">
                <Input {...field} type="text" autoComplete="postal-code" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="sm:col-span-2">
        <FormField
          control={form.control}
          name="shippingPhone"
          render={({ field }) => (
            <FormItem>
              <FormLabel htmlFor={field.name}>Phone</FormLabel>
              <FormControl className="mt-1">
                <Input {...field} type="text" autoComplete="tel" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
