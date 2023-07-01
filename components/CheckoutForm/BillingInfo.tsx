import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

import { Input, Label } from '@components/ui';
import { shippingLocations } from '@const/shippingLocation';

export default function BillingInfo() {
  const {
    register,
    control,
    formState: { errors },
    watch,
    getValues,
  } = useFormContext();

  console.log('billingSameAsShipping', getValues('billingSameAsShipping'));

  return (
    <>
      <h2 className="text-lg font-medium text-gray-900">Billing information</h2>
      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
        <div className="flex items-center">
          <input
            id="billingSameAsShipping"
            type="checkbox"
            {...register('billingSameAsShipping')}
            className="h-4 w-4 rounded border-gray-300 text-primary-400 focus:ring-primary-500"
          />
          <div className="ml-2">
            <label
              htmlFor="billingSameAsShipping"
              className="text-sm font-medium text-gray-900"
            >
              Same as shipping information
            </label>
          </div>
        </div>

        {watch('billingSameAsShipping') === false && (
          <>
            <div className="sm:col-span-2">
              <Label htmlFor="billingAddressLine1">Address</Label>
              <div className="mt-1">
                <Input
                  id="billingAddressLine1"
                  type="text"
                  autoComplete="street-address"
                  {...register('billingAddressLine1')}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="billingAddressLine1"
                as="p"
                className="text-sm font-medium text-red-500 mt-1 ml-1"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="billingAddressLine2">
                Apartment, suite, etc.
              </Label>
              <div className="mt-1">
                <Input
                  id="billingAddressLine2"
                  type="text"
                  {...register('billingAddressLine2')}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="billingAddressLine2"
                as="p"
                className="text-sm font-medium text-red-500 mt-1 ml-1"
              />
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="billingCompany">Company</Label>
              <div className="mt-1">
                <Input
                  id="billingCompany"
                  type="text"
                  {...register('billingCompany')}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="billingCompany"
                as="p"
                className="text-sm font-medium text-red-500 mt-1 ml-1"
              />
            </div>
            <div>
              <Label htmlFor="billingCity">City</Label>
              <div className="mt-1">
                <Input
                  id="billingCity"
                  type="text"
                  autoComplete="address-level2"
                  {...register('billingCity')}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="billingCity"
                as="p"
                className="text-sm font-medium text-red-500 mt-1 ml-1"
              />
            </div>
            <div>
              <Label htmlFor="billingCountry">Country</Label>
              <Controller
                control={control}
                name="billingCountry"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <>
                    <div className="mt-1">
                      <select
                        id="billingCountry"
                        autoComplete="country-name"
                        defaultValue={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        ref={ref}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="" disabled>
                          Select a country
                        </option>
                        <option value="CA">Canada</option>
                      </select>
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="billingCountry"
                      as="p"
                      className="text-sm font-medium text-red-500 mt-1 ml-1"
                    />
                  </>
                )}
              />
            </div>
            <div>
              <Label htmlFor="billingArea">State / Province</Label>
              <Controller
                control={control}
                name="billingArea"
                render={({ field: { onChange, onBlur, value, ref } }) => (
                  <>
                    <div className="mt-1">
                      <select
                        id="billingArea"
                        defaultValue={value}
                        onChange={onChange}
                        onBlur={onBlur}
                        ref={ref}
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
                      >
                        <option value="" disabled>
                          Select a state / province
                        </option>
                        {shippingLocations[0].stateOrProvince.map(
                          (state, stateIdx) => (
                            <option key={stateIdx} value={state.value}>
                              {state.name}
                            </option>
                          )
                        )}
                      </select>
                    </div>
                    <ErrorMessage
                      errors={errors}
                      name="billingArea"
                      as="p"
                      className="text-sm font-medium text-red-500 mt-1 ml-1"
                    />
                  </>
                )}
              />
            </div>
            <div>
              <Label htmlFor="billingPostalCode">Postal Code</Label>
              <div className="mt-1">
                <Input
                  id="billingPostalCode"
                  type="text"
                  autoComplete="postal-code"
                  {...register('billingPostalCode')}
                />
              </div>
              <ErrorMessage
                errors={errors}
                name="billingPostalCode"
                as="p"
                className="text-sm font-medium text-red-500 mt-1 ml-1"
              />
            </div>
          </>
        )}
      </div>
    </>
  );
}
