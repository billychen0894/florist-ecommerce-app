'use client';

import AdminNavigation from '@components/Admin/AdminNavigation';
import { useAppDispatch } from '@store/hooks';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { useSession } from '@node_modules/next-auth/react';
import { redirect } from '@node_modules/next/navigation';
import { useEffect } from 'react';
import { fetchUserById } from '@store/features/userSlice';
import {
  fetchAccountUsers,
  fetchCategories,
  fetchOrders,
} from '@store/features/adminSlice';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
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
      dispatch(fetchCategories());
    }
  }, [dispatch, session, axiosWithAuth]);
  return (
    <div className="min-h-full">
      <AdminNavigation />
      <main>{children}</main>
    </div>
  );
}
