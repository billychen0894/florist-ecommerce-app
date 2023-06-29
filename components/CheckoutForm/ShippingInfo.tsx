import { ErrorMessage } from '@hookform/error-message';
import { Controller, useFormContext } from 'react-hook-form';

import { Input, Label } from '@components/ui';
import { shippingLocations } from '@const/shippingLocation';

export default function ShippingInfo() {
  const {
    register,
    control,
    formState: { errors },
  } = useFormContext();

  return (
    <>
      <h2 className="text-lg font-medium text-gray-900">
        Shipping information
      </h2>
      <div className="mt-4 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-4">
        <div>
          <Label htmlFor="shippingFirstName">First name</Label>
          <div className="mt-1">
            <Input
              id="shippingFirstName"
              type="text"
              autoComplete="given-name"
              {...register('shippingFirstName')}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingFirstName"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>

        <div>
          <Label htmlFor="shippingLastName">Last name</Label>
          <div className="mt-1">
            <Input
              id="shippingLastName"
              type="text"
              autoComplete="family-name"
              {...register('shippingLastName')}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingLastName"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="shippingCompany">Company</Label>
          <div className="mt-1">
            <Input
              id="shippingCompany"
              type="text"
              {...register('shippingCompany')}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingCompany"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="shippingAddressLine1">Address</Label>
          <div className="mt-1">
            <Input
              id="shippingAddressLine1"
              type="text"
              autoComplete="street-address"
              {...register('shippingAddressLine1')}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingAddressLine1"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="shippingAddressLine2">Apartment, suite, etc.</Label>
          <div className="mt-1">
            <Input
              id="shippingAddressLine2"
              type="text"
              {...register('shippingAddressLine2')}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingAddressLine2"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>

        <div>
          <Label htmlFor="shippingCity">City</Label>
          <div className="mt-1">
            <Input
              id="shippingCity"
              type="text"
              autoComplete="address-level2"
              {...register('shippingCity')}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingCity"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>

        <div>
          <Label htmlFor="shippingCountry">Country</Label>
          <Controller
            control={control}
            name="shippingCountry"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <>
                <div className="mt-1">
                  <select
                    id="shippingCountry"
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
                  name="shippingCountry"
                  as="p"
                  className="text-sm font-medium text-red-500 mt-1 ml-1"
                />
              </>
            )}
          />
        </div>

        <div>
          <Label htmlFor="shippingArea">State / Province</Label>
          <Controller
            control={control}
            name="shippingArea"
            render={({ field: { onChange, onBlur, value, ref } }) => (
              <>
                <div className="mt-1">
                  <select
                    id="shippingArea"
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
                  name="shippingArea"
                  as="p"
                  className="text-sm font-medium text-red-500 mt-1 ml-1"
                />
              </>
            )}
          />
        </div>

        <div>
          <Label htmlFor="shippingPostalCode">Postal Code</Label>
          <div className="mt-1">
            <Input
              id="shippingPostalCode"
              type="text"
              autoComplete="postal-code"
              {...register('shippingPostalCode')}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingPostalCode"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="shippingPhone">Phone</Label>
          <div className="mt-1">
            <Input
              id="shippingPhone"
              type="text"
              autoComplete="tel"
              {...register('shippingPhone')}
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingPhone"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>
      </div>
    </>
  );
}
