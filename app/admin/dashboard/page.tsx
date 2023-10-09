'use client';

import StatCard from '@components/ui/StatCard';
import { useAppSelector } from '@store/hooks';
import { useSession } from '@node_modules/next-auth/react';
import { redirect } from '@node_modules/next/navigation';
import { formatCurrency } from '@lib/formatCurrency';

export default function Dashboard() {
  const accountUsers = useAppSelector(
    (state) => state.adminReducer.accountUsers
  );
  const orders = useAppSelector((state) => state.adminReducer.orders);
  const { data: session, status } = useSession();
  const totalRevenue = orders.reduce((pre, curr) => {
    return pre + curr.total;
  }, 0);

  if (session?.user.role !== 'admin' && status === 'unauthenticated') {
    redirect('/denied');
  }

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
          <StatCard name="Total Orders" stat={orders.length.toString()} />
          <StatCard
            name="Revenue"
            stat={formatCurrency(totalRevenue, 'en-CA', 'CAD')}
          />
        </dl>
      </div>
    </div>
  );
}
