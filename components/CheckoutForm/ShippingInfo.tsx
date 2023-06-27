import { UseFormReturn } from 'react-hook-form';

import { Input } from '@components/ui';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@components/ui/Select';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@components/ui/form';
import { shippingLocations } from '@const/shippingLocation';
import { type FormData } from './CheckoutForm';

interface ShippingInfoProps {
  form: UseFormReturn<FormData>;
}

export default function ShippingInfo({ form }: ShippingInfoProps) {
  return (
    <>
      <h2 className="text-lg font-medium text-gray-900">
        Shipping information
      </h2>
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
                <FormLabel htmlFor={field.name}>
                  Apartment, suite, etc.
                </FormLabel>
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
                <FormLabel>Country</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="mt-1">
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      <SelectItem value="CA">Canada</SelectItem>
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
                <FormLabel>State / Province</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl className="mt-1">
                    <SelectTrigger>
                      <SelectValue placeholder="" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectGroup>
                      {shippingLocations[0].stateOrProvince.map(
                        (state, idx) => (
                          <SelectItem key={idx} value={state.value}>
                            {state.name}
                          </SelectItem>
                        )
                      )}
                    </SelectGroup>
                  </SelectContent>
                </Select>
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
    </>
  );
}
