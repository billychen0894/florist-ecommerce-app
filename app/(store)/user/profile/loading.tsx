import ProfileAndSettingsSkeleton from '@components/User/ProfileAndSettingsSkeleton';

export default function ProfileLoading() {
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

        <ProfileAndSettingsSkeleton />
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
        <ProfileAndSettingsSkeleton />
      </div>
    </div>
  );
}
