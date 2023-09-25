'use client';

import { yupResolver } from '@hookform/resolvers/yup';
import { useCallback, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

import {
  createStripeCustomer,
  updateStripeCustomer,
} from '@actions/stripeCustomer';
import { Input, Label } from '@components/ui';
import Button from '@components/ui/Button';
import Spinner from '@components/ui/Spinner';
import { shippingLocations } from '@const/shippingLocation';
import { ErrorMessage } from '@hookform/error-message';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { users } from '@lib/api/users';
import { updateUserStripeInfo } from '@store/features/userSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import {
  BillingShippingFormSchema,
  defaultBillingShippingFormSchema,
} from './billingShippingFormValidator';

interface BillingShippingFormProps {
  isInputsDisabled: boolean;
}

export default function BillingShippingForm({
  isInputsDisabled,
}: BillingShippingFormProps) {
  const userStripeInfo = useAppSelector(
    (state) => state.userReducer.userStripe
  );
  const user = useAppSelector((state) => state.userReducer.user);
  const dispacth = useAppDispatch();
  const axiosWithAuth = useAxiosWithAuth();
  const billingAddressObj = userStripeInfo?.address;
  const shippingAddressObj = userStripeInfo?.shipping?.address;

  const methods = useForm<BillingShippingFormSchema>({
    resolver: yupResolver(defaultBillingShippingFormSchema),
    defaultValues: {
      shippingAddressLine1: shippingAddressObj?.line1!,
      shippingAddressLine2: shippingAddressObj?.line2!,
      shippingCity: shippingAddressObj?.city!,
      shippingArea: shippingAddressObj?.state!,
      shippingPostalCode: shippingAddressObj?.postal_code!,
      shippingCountry: shippingAddressObj?.country!,
      billingAddressLine1: billingAddressObj?.line1!,
      billingAddressLine2: billingAddressObj?.line2!,
      billingCity: billingAddressObj?.city!,
      billingArea: billingAddressObj?.state!,
      billingPostalCode: billingAddressObj?.postal_code!,
      billingCountry: billingAddressObj?.country!,
    },
  });

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
    setValue,
  } = methods;

  useEffect(() => {
    const formDefaultValues: { [key: string]: string } = {
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
    };

    Object.keys(formDefaultValues).forEach((key) =>
      setValue(key, formDefaultValues[key] as never)
    );
  }, [billingAddressObj, shippingAddressObj, setValue]);

  const isFormDataSameAsCurrent = useCallback(
    (formData: BillingShippingFormSchema): boolean => {
      if (shippingAddressObj && billingAddressObj && formData) {
        return (
          formData.shippingAddressLine1 === shippingAddressObj?.line1 &&
          formData.shippingAddressLine2 === shippingAddressObj?.line2 &&
          formData.shippingCity === shippingAddressObj?.city &&
          formData.shippingArea === shippingAddressObj?.state &&
          formData.shippingPostalCode === shippingAddressObj?.postal_code &&
          formData.shippingCountry === shippingAddressObj?.country &&
          formData.billingAddressLine1 === billingAddressObj?.line1 &&
          formData.billingAddressLine2 === billingAddressObj?.line2 &&
          formData.billingCity === billingAddressObj?.city &&
          formData.billingArea === billingAddressObj?.state &&
          formData.billingPostalCode === billingAddressObj?.postal_code &&
          formData.billingCountry === billingAddressObj?.country
        );
      }
      return false;
    },
    [billingAddressObj, shippingAddressObj]
  );

  const onSubmit = async (data: BillingShippingFormSchema) => {
    try {
      const isDataSameAsCurrent = isFormDataSameAsCurrent(data);

      if (!isDirty || isDataSameAsCurrent) {
        toast.error('No information updated. Cannot save');
        return;
      }

      const {
        shippingAddressLine1,
        shippingAddressLine2,
        shippingCity,
        shippingArea,
        shippingPostalCode,
        shippingCountry,
        billingAddressLine1,
        billingAddressLine2,
        billingCity,
        billingArea,
        billingPostalCode,
        billingCountry,
      } = data;

      const stripeInfo = {
        address: {
          city: billingCity,
          country: billingCountry,
          line1: billingAddressLine1,
          line2: billingAddressLine2,
          postal_code: billingPostalCode,
          state: billingArea,
        },
        shipping: {
          address: {
            city: shippingCity,
            country: shippingCountry,
            line1: shippingAddressLine1,
            line2: shippingAddressLine2,
            postal_code: shippingPostalCode,
            state: shippingArea,
          },
          name: user?.name,
          phone: user?.phone,
        },
      };

      if (user?.stripeCustomerId) {
        await updateStripeCustomer(user?.stripeCustomerId, stripeInfo);

        dispacth(updateUserStripeInfo(stripeInfo));

        toast.success('Successfully updated!');
      } else {
        const stripeCustomerId = await createStripeCustomer(stripeInfo);

        if (stripeCustomerId) {
          await users.updateUser(
            {
              stripeCustomerId: stripeCustomerId,
            },
            user?.id!,
            axiosWithAuth
          );
        }
      }
    } catch (err: any) {
      console.log('Error: ', err.message);
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
      <div className="mt-8 flex">
        <Button
          type="submit"
          className={
            isSubmitting
              ? 'bg-secondary-200 text-secondary-400 cursor-not-allowed border-secondary-300 hover:bg-secondary-200'
              : 'bg-secondary-500 hover:bg-secondary-400'
          }
          disabled={isSubmitting}
        >
          <div className="flex">
            {isSubmitting && <Spinner />}
            <span className="block">Save</span>
          </div>
        </Button>
      </div>
    </form>
  );
}
