'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import { useEffect } from 'react';

import BillingShippingForm from '@components/User/BillingShippingForm';
import PersonalInfoForm from '@components/User/PersonalInfoForm';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import {
  fetchUserById,
  fetchUserByStripeId,
  fetchUserInvoices,
} from '@store/features/userSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

export default function Profile() {
  const { data: session, status } = useSession();

  if (!session && status === 'unauthenticated') {
    redirect('/auth/signin');
  }

  const axiosWithAuth = useAxiosWithAuth();
  const user = useAppSelector((state) => state.userReducer.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (session?.user.id) {
      dispatch(
        fetchUserById({
          userId: session?.user.id as string,
          axiosWithAuth: axiosWithAuth,
        })
      );
    }

    if (user?.stripeCustomerId) {
      dispatch(fetchUserByStripeId(user.stripeCustomerId));
      dispatch(fetchUserInvoices(user.stripeCustomerId));
    }
  }, [dispatch, axiosWithAuth, session?.user.id, user?.stripeCustomerId]);

  return (
    <div className="divide-y divide-white/5">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-800">
            Personal Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            To update your personal information, please go to settings.
          </p>
        </div>

        <PersonalInfoForm isInputsDisabled />
      </div>

      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-800">
            Billing and Shipping Information
          </h2>
          <p className="mt-1 text-sm leading-6 text-gray-400">
            To update your billing and shipping information, please go to
            settings.
          </p>
        </div>
        <BillingShippingForm isInputsDisabled />
      </div>
    </div>
  );
}
