'use client';

import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import { Input, Label } from '@/components/ui';
import Button from '@/components/ui/Button';
import Spinner from '@/components/ui/Spinner';
import { shippingLocations } from '@/const/shippingLocation';
import { onSubmitBillingShippingForm } from '@/lib/formActions';
import {
  BillingShippingFormSchema,
  billingShippingFormSchema,
} from '@/lib/schemaValidator';
import { UserWithoutPass } from '@/lib/types/types';
import { ErrorMessage } from '@hookform/error-message';
import { zodResolver } from '@hookform/resolvers/zod';
import Stripe from 'stripe';

interface BillingShippingFormProps {
  isInputsDisabled: boolean;
  user: UserWithoutPass | null;
  userStripeInfo: Stripe.Customer | null;
}

export default function BillingShippingForm({
  user,
  userStripeInfo,
  isInputsDisabled,
}: BillingShippingFormProps) {
  const billingAddressObj = userStripeInfo?.address;
  const shippingAddressObj = userStripeInfo?.shipping?.address;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<BillingShippingFormSchema>({
    resolver: zodResolver(billingShippingFormSchema),
    defaultValues: {
      shippingAddressLine1: shippingAddressObj?.line1 || '',
      shippingAddressLine2: shippingAddressObj?.line2 || '',
      shippingCity: shippingAddressObj?.city || '',
      shippingArea: shippingAddressObj?.state || '',
      shippingPostalCode: shippingAddressObj?.postal_code || '',
      shippingCountry: shippingAddressObj?.country || '',
      billingAddressLine1: billingAddressObj?.line1 || '',
      billingAddressLine2: billingAddressObj?.line2 || '',
      billingCity: billingAddressObj?.city || '',
      billingArea: billingAddressObj?.state || '',
      billingPostalCode: billingAddressObj?.postal_code || '',
      billingCountry: billingAddressObj?.country || '',
    },
  });

  const onSubmit = async (data: BillingShippingFormSchema) => {
    try {
      if (!isDirty) {
        toast.error('No information updated. Cannot save');
        return;
      }

      const formData = new FormData();

      for (const key of Object.keys(data)) {
        const value = data[key as keyof BillingShippingFormSchema];
        if (value) {
          formData.append(key, value);
        } else {
          formData.append(key, '');
        }
      }

      if (!user) {
        throw new Error('No user found');
      }

      const result = await onSubmitBillingShippingForm(formData, user);

      if (!result.success) {
        throw new Error('Error updating user information');
      }

      toast.success('User information updated successfully');
    } catch (error) {
      console.error(error);
      toast.error('Error updating user information');
    }
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="md:col-span-2 space-y-10"
    >
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full">
          <Label
            htmlFor="shippingAddressLine1"
            className="block text-sm font-medium leading-6 text-gray-800"
          >
            Shipping address
          </Label>
          <div className="mt-2">
            <Input
              type="text"
              id="shippingAddressLine1"
              defaultValue={shippingAddressObj?.line1! || ''}
              autoComplete="street-address"
              {...register('shippingAddressLine1')}
              disabled={isInputsDisabled}
              className={` ${
                isInputsDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                  : null
              }`}
              data-cy="shippingAddressLine1-input"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingAddressLine1"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>
        <div className="col-span-full">
          <Label htmlFor="shippingAddressLine2">Apartment, suite, etc.</Label>
          <div className="mt-2">
            <Input
              id="shippingAddressLine2"
              type="text"
              defaultValue={shippingAddressObj?.line2! || ''}
              {...register('shippingAddressLine2')}
              disabled={isInputsDisabled}
              className={` ${
                isInputsDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                  : null
              }`}
              data-cy="shippingAddressLine2-input"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingAddressLine2"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
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
              {...register('shippingCity')}
              className={` ${
                isInputsDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                  : null
              }`}
              data-cy="shippingCity-input"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingCity"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="shippingCountry">Country</Label>
          <div className="mt-2">
            <select
              id="shippingCountry"
              autoComplete="country-name"
              disabled={isInputsDisabled}
              defaultValue={shippingAddressObj?.country! || ''}
              {...register('shippingCountry')}
              className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 ${
                isInputsDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  : null
              }`}
              data-cy="shippingCountry-input"
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
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="shippingArea">State / Province</Label>
          <div className="mt-2">
            <select
              id="shippingArea"
              disabled={isInputsDisabled}
              defaultValue={shippingAddressObj?.state || ''}
              {...register('shippingArea')}
              className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 ${
                isInputsDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed '
                  : null
              }`}
              data-cy="shippingArea-input"
            >
              <option value="" disabled>
                Select a state / province
              </option>
              {shippingLocations[0].stateOrProvince.map((state, stateIdx) => (
                <option key={stateIdx} value={state.value}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingArea"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="shippingPostalCode">Postal Code</Label>
          <div className="mt-2">
            <Input
              id="shippingPostalCode"
              type="text"
              autoComplete="postal-code"
              {...register('shippingPostalCode')}
              defaultValue={shippingAddressObj?.postal_code || ''}
              disabled={isInputsDisabled}
              className={` ${
                isInputsDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                  : null
              }`}
              data-cy="shippingPostalCode-input"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="shippingPostalCode"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-2 sm:max-w-xl sm:grid-cols-6">
        <div className="col-span-full">
          <Label
            htmlFor="billingAddressLine1"
            className="block text-sm font-medium leading-6 text-gray-800"
          >
            Billing address
          </Label>
          <div className="mt-2">
            <Input
              type="text"
              id="billingAddressLine1"
              autoComplete="street-address"
              {...register('billingAddressLine1')}
              defaultValue={billingAddressObj?.line1 || ''}
              disabled={isInputsDisabled}
              className={` ${
                isInputsDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                  : null
              }`}
              data-cy="billingAddressLine1-input"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="billingAddressLine1"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>
        <div className="col-span-full">
          <Label htmlFor="billingAddressLine2">Apartment, suite, etc.</Label>
          <div className="mt-2">
            <Input
              id="billingAddressLine2"
              type="text"
              disabled={isInputsDisabled}
              {...register('billingAddressLine2')}
              defaultValue={billingAddressObj?.line2 || ''}
              className={` ${
                isInputsDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                  : null
              }`}
              datat-cy="billingAddressLine2-input"
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
          <Label htmlFor="billingCity">City</Label>
          <div className="mt-2">
            <Input
              id="billingCity"
              type="text"
              autoComplete="address-level2"
              disabled={isInputsDisabled}
              {...register('billingCity')}
              defaultValue={billingAddressObj?.city || ''}
              className={` ${
                isInputsDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                  : null
              }`}
              data-cy="billingCity-input"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="billingCity"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="billingCountry">Country</Label>
          <div className="mt-2">
            <select
              id="billingCountry"
              autoComplete="country-name"
              disabled={isInputsDisabled}
              {...register('billingCountry')}
              defaultValue={billingAddressObj?.country || ''}
              className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 ${
                isInputsDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed '
                  : null
              }`}
              data-cy="billingCountry-input"
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
        </div>

        <div className="sm:col-span-2">
          <Label htmlFor="billingArea">State / Province</Label>
          <div className="mt-2">
            <select
              id="billingArea"
              disabled={isInputsDisabled}
              {...register('billingArea')}
              defaultValue={billingAddressObj?.state || ''}
              className={`block w-full rounded-md shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm border-gray-300 ${
                isInputsDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed '
                  : null
              }`}
              data-cy="billingArea-input"
            >
              <option value="" disabled>
                Select a state / province
              </option>
              {shippingLocations[0].stateOrProvince.map((state, stateIdx) => (
                <option key={stateIdx} value={state.value}>
                  {state.name}
                </option>
              ))}
            </select>
          </div>
          <ErrorMessage
            errors={errors}
            name="billingArea"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>
        <div className="sm:col-span-2">
          <Label htmlFor="billingPostalCode">Postal Code</Label>
          <div className="mt-2">
            <Input
              id="billingPostalCode"
              type="text"
              autoComplete="postal-code"
              {...register('billingPostalCode')}
              defaultValue={billingAddressObj?.postal_code || ''}
              disabled={isInputsDisabled}
              className={` ${
                isInputsDisabled
                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed border-gray-300'
                  : null
              }`}
              data-cy="billingPostalCode-input"
            />
          </div>
          <ErrorMessage
            errors={errors}
            name="billingPostalCode"
            as="p"
            className="text-sm font-medium text-red-500 mt-1 ml-1"
          />
        </div>
      </div>
      {!isInputsDisabled && (
        <div className="mt-8 flex">
          <Button
            type="submit"
            className={
              isSubmitting
                ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed border-secondary-300 hover:bg-secondary-200'
                : 'bg-secondary-500 hover:bg-secondary-400'
            }
            disabled={isSubmitting}
            data-cy="address-save-btn"
          >
            <div className="flex">
              {isSubmitting && <Spinner />}
              <span className="block">Save</span>
            </div>
          </Button>
        </div>
      )}
    </form>
  );
}
