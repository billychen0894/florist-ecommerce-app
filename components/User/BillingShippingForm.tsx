'use client';

import { Input, Label } from '@components/ui';
import { Skeleton } from '@components/ui/Skeleton';
import { shippingLocations } from '@const/shippingLocation';
import { useAppSelector } from '@store/hooks';

interface BillingShippingFormProps {
  isInputsDisabled: boolean;
}

export default function BillingShippingForm({
  isInputsDisabled,
}: BillingShippingFormProps) {
  const userStripeInfo = useAppSelector(
    (state) => state.userReducer.userStripe
  );
  const billingAddressObj = userStripeInfo?.address;
  const shippingAddressObj = userStripeInfo?.shipping?.address;

  const skeletonLoadingUI = (
    <Skeleton className="md:col-span-2 space-y-10">
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
        <div className="col-span-full">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
        <div className="sm:col-span-2">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
        <div className="sm:col-span-2">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
        <div className="sm:col-span-2">
          <div className="h-6 max-w-[6rem] bg-slate-200 rounded-lg" />
          <div className="mt-2 h-10 bg-slate-200 rounded-lg " />
        </div>
      </div>
    </Skeleton>
  );

  return (
    <>
      {shippingAddressObj && billingAddressObj ? (
        <form className="md:col-span-2 space-y-10">
          <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <Label
                htmlFor="shippingAddressLine1"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                Shipping adress
              </Label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="shippingAddressLine1"
                  id="shippingAddressLine1"
                  defaultValue={shippingAddressObj?.line1! || ''}
                  autoComplete="street-address"
                  disabled={isInputsDisabled}
                  className={` ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : null
                  }`}
                />
              </div>
            </div>
            <div className="col-span-full">
              <Label htmlFor="shippingAddressLine2">
                Apartment, suite, etc.
              </Label>
              <div className="mt-2">
                <Input
                  id="shippingAddressLine2"
                  type="text"
                  defaultValue={shippingAddressObj?.line2! || ''}
                  disabled={isInputsDisabled}
                  className={` ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : null
                  }`}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="shippingCity">City</Label>
              <div className="mt-2">
                <Input
                  id="shippingCity"
                  type="text"
                  autoComplete="address-level2"
                  disabled={isInputsDisabled}
                  defaultValue={shippingAddressObj?.city || ''}
                  className={` ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : null
                  }`}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="shippingCountry">Country</Label>

              <div className="mt-2">
                <select
                  id="shippingCountry"
                  autoComplete="country-name"
                  disabled={isInputsDisabled}
                  defaultValue={shippingAddressObj?.country! || ''}
                  className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                      : null
                  }`}
                >
                  <option value="" disabled>
                    Select a country
                  </option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="shippingArea">State / Province</Label>

              <div className="mt-2">
                <select
                  id="shippingArea"
                  disabled={isInputsDisabled}
                  defaultValue={shippingAddressObj?.state || ''}
                  className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed '
                      : null
                  }`}
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
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="shippingPostalCode">Postal Code</Label>
              <div className="mt-2">
                <Input
                  id="shippingPostalCode"
                  type="text"
                  autoComplete="postal-code"
                  defaultValue={shippingAddressObj?.postal_code || ''}
                  disabled={isInputsDisabled}
                  className={` ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : null
                  }`}
                />
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:max-w-xl sm:grid-cols-6">
            <div className="col-span-full">
              <Label
                htmlFor="shippingAddressLine1"
                className="block text-sm font-medium leading-6 text-gray-800"
              >
                Billing adress
              </Label>
              <div className="mt-2">
                <Input
                  type="text"
                  name="shippingAddressLine1"
                  id="shippingAddressLine1"
                  autoComplete="street-address"
                  defaultValue={billingAddressObj?.line1 || ''}
                  disabled={isInputsDisabled}
                  className={` ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : null
                  }`}
                />
              </div>
            </div>
            <div className="col-span-full">
              <Label htmlFor="shippingAddressLine2">
                Apartment, suite, etc.
              </Label>
              <div className="mt-2">
                <Input
                  id="shippingAddressLine2"
                  type="text"
                  disabled={isInputsDisabled}
                  defaultValue={billingAddressObj?.line2 || ''}
                  className={` ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : null
                  }`}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="shippingCity">City</Label>
              <div className="mt-2">
                <Input
                  id="shippingCity"
                  type="text"
                  autoComplete="address-level2"
                  disabled={isInputsDisabled}
                  defaultValue={billingAddressObj?.city || ''}
                  className={` ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : null
                  }`}
                />
              </div>
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="shippingCountry">Country</Label>

              <div className="mt-2">
                <select
                  id="shippingCountry"
                  autoComplete="country-name"
                  disabled={isInputsDisabled}
                  defaultValue={billingAddressObj?.country || ''}
                  className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed '
                      : null
                  }`}
                >
                  <option value="" disabled>
                    Select a country
                  </option>
                  <option value="CA">Canada</option>
                </select>
              </div>
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="shippingArea">State / Province</Label>

              <div className="mt-2">
                <select
                  id="shippingArea"
                  disabled={isInputsDisabled}
                  defaultValue={billingAddressObj?.state || ''}
                  className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed '
                      : null
                  }`}
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
            </div>
            <div className="sm:col-span-2">
              <Label htmlFor="shippingPostalCode">Postal Code</Label>
              <div className="mt-2">
                <Input
                  id="shippingPostalCode"
                  type="text"
                  autoComplete="postal-code"
                  defaultValue={billingAddressObj?.postal_code || ''}
                  disabled={isInputsDisabled}
                  className={` ${
                    isInputsDisabled
                      ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                      : null
                  }`}
                />
              </div>
            </div>
          </div>
        </form>
      ) : (
        skeletonLoadingUI
      )}
    </>
  );
}
