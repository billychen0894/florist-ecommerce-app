import { RadioGroup } from '@headlessui/react';
import { UseFormReturn } from 'react-hook-form';

import { FormControl, FormField, FormItem } from '@components/ui/form';
import { deliveryMethods } from '@const/deliveryMethod';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { cn } from '@lib/classNames';
import { type FormData } from './CheckoutForm';

interface DeliveryMethodProps {
  form: UseFormReturn<FormData>;
}

export default function DeliveryMethod({ form }: DeliveryMethodProps) {
  return (
    <FormField
      control={form.control}
      name="deliveryMethod"
      render={({ field }) => (
        <FormItem>
          <FormControl>
            <RadioGroup defaultValue={field.value} onChange={field.onChange}>
              <RadioGroup.Label
                htmlFor={field.name}
                className="text-lg font-medium text-gray-900"
              >
                Delivery method
              </RadioGroup.Label>

              <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
                {deliveryMethods.map((deliveryMethod) => (
                  <RadioGroup.Option
                    key={deliveryMethod.title}
                    value={deliveryMethod}
                    className={({ checked, active }) =>
                      cn(
                        checked ? 'border-transparent' : 'border-gray-300',
                        active ? 'ring-2 ring-primary-500' : '',
                        'relative flex cursor-pointer rounded-lg border bg-white p-4 shadow-sm focus:outline-none'
                      )
                    }
                  >
                    {({ checked, active }) => (
                      <>
                        <span className="flex flex-1">
                          <span className="flex flex-col">
                            <RadioGroup.Label
                              as="span"
                              className="block text-sm font-medium text-gray-900"
                            >
                              {deliveryMethod.title}
                            </RadioGroup.Label>
                            <RadioGroup.Description
                              as="span"
                              className="mt-1 flex items-center text-sm text-gray-500"
                            >
                              {deliveryMethod.turnaround ||
                                deliveryMethod.locationOperation}
                            </RadioGroup.Description>
                            <RadioGroup.Description
                              as="span"
                              className="mt-6 text-sm font-medium text-gray-900"
                            >
                              {/* TODO: Implement estmiating delivery price */}
                              {/* TODO: Implement closest pickup location based on user location */}
                              {deliveryMethod.price || deliveryMethod.location}
                            </RadioGroup.Description>
                          </span>
                        </span>
                        {checked ? (
                          <CheckCircleIcon
                            className="h-5 w-5 text-primary-500"
                            aria-hidden="true"
                          />
                        ) : null}
                        <span
                          className={cn(
                            active ? 'border' : 'border-2',
                            checked
                              ? 'border-primary-500'
                              : 'border-transparent',
                            'pointer-events-none absolute -inset-px rounded-lg'
                          )}
                          aria-hidden="true"
                        />
                      </>
                    )}
                  </RadioGroup.Option>
                ))}
              </div>
            </RadioGroup>
          </FormControl>
        </FormItem>
      )}
    />
  );
}
