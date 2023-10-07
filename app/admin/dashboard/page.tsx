'use client';

import StatCard from '@components/ui/StatCard';
import { useAppSelector } from '@store/hooks';

export default function Dashboard() {
  const accountUsers = useAppSelector(
    (state) => state.adminReducer.accountUsers
  );

  return (
    <div className="mx-auto max-w-7xl py-6 sm:px-6 lg:px-8">
      <div>
        <h3 className="text-base font-semibold leading-6 text-gray-900">
          Last 30 days
        </h3>
        <dl className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-3">
          <StatCard
            name="Total Account Users"
            stat={accountUsers.length.toString()}
          />
          <StatCard name="Total Orders" stat="123" />
          <StatCard name="Revenue" stat="123" />
        </dl>
      </div>
    </div>
  );
}
