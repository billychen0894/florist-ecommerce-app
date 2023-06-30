import { RadioGroup } from '@headlessui/react';
import { CheckCircleIcon } from '@heroicons/react/20/solid';
import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

import { deliveryMethods } from '@const/deliveryMethod';
import { cn } from '@lib/classNames';

export default function DeliveryMethod() {
  const {
    control,
    formState: { errors },
  } = useFormContext();
  return (
    <Controller
      control={control}
      name="deliveryMethod"
      render={({ field: { onChange, onBlur, value, ref } }) => (
        <>
          <RadioGroup
            defaultValue={value}
            onChange={onChange}
            onBlur={onBlur}
            ref={ref}
          >
            <RadioGroup.Label
              htmlFor="deliveryMethod"
              className="text-lg font-medium text-gray-900"
            >
              Delivery method
            </RadioGroup.Label>

            <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
              {deliveryMethods.map((deliveryMethod) => (
                <RadioGroup.Option
                  key={deliveryMethod.title}
                  value={deliveryMethod.value}
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
                          checked ? 'border-primary-500' : 'border-transparent',
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
          <ErrorMessage
            errors={errors}
            name="deliveryMethod"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </>
      )}
    />
  );
}
