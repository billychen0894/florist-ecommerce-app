import BillingShippingForm from '@components/User/BillingShippingForm';
import PersonalInfoForm from '@components/User/PersonalInfoForm';

export const dynamic = 'force-static';

export default function Settings() {
  return (
    <div className="divide-y divide-white/5">
      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-800">
            Personal Information
          </h2>
        </div>

        <PersonalInfoForm isInputsDisabled={false} />
      </div>

      <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
        <div>
          <h2 className="text-base font-semibold leading-7 text-gray-800">
            Billing and Shipping Information
          </h2>
        </div>
        <BillingShippingForm isInputsDisabled={false} />
      </div>
    </div>
  );
}
