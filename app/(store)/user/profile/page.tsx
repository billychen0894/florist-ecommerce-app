import { fetchUserByStripeId, getUser } from '@actions/userActions';
import { options } from '@app/api/auth/[...nextauth]/options';
import BillingShippingForm from '@components/User/BillingShippingForm';
import PersonalInfoForm from '@components/User/PersonalInfoForm';
import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import { Suspense } from 'react';

export default async function Profile() {
  const session = await getServerSession(options);

  if (!session) {
    redirect('/auth/signin');
  }

  const user = await getUser(session?.user?.id);
  const userStripeInfo = user?.stripeCustomerId
    ? await fetchUserByStripeId(user?.stripeCustomerId)
    : null;

  const userStripeInfoCopy = JSON.parse(JSON.stringify(userStripeInfo));

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

        <PersonalInfoForm isInputsDisabled user={user} />
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
        <BillingShippingForm
          isInputsDisabled
          user={user}
          userStripeInfo={userStripeInfoCopy}
        />
      </div>
    </div>
  );
}
