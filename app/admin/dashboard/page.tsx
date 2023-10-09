'use client';

import StatCard from '@components/ui/StatCard';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { useSession } from '@node_modules/next-auth/react';
import { redirect } from '@node_modules/next/navigation';
import { useEffect } from 'react';
import { fetchUserById } from '@store/features/userSlice';
import { fetchAccountUsers, fetchOrders } from '@store/features/adminSlice';

export default function Dashboard() {
  const accountUsers = useAppSelector(
    (state) => state.adminReducer.accountUsers
  );
  const orders = useAppSelector((state) => state.adminReducer.orders);

  const admin = useAppSelector((state) => state.userReducer.user);
  const dispatch = useAppDispatch();
  const axiosWithAuth = useAxiosWithAuth();
  const { data: session, status } = useSession();

  if (session?.user.role !== 'admin' && status === 'unauthenticated') {
    redirect('/denied');
  }

  useEffect(() => {
    if (session && session.user.role === 'admin') {
      dispatch(fetchUserById({ userId: session.user.id, axiosWithAuth }));
      dispatch(fetchAccountUsers(axiosWithAuth));
      dispatch(fetchOrders(axiosWithAuth));
    }
  }, [admin, dispatch, session, axiosWithAuth]);

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
          <StatCard name="Revenue" stat="123" />
        </dl>
      </div>
    </div>
  );
}
