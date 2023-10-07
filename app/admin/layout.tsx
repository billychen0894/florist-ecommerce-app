'use client';

import AdminNavigation from '@components/Admin/AdminNavigation';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect } from 'react';
import { fetchUserById } from '@store/features/userSlice';
import { useSession } from 'next-auth/react';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { redirect } from 'next/navigation';
import { fetchAccountUsers } from '@store/features/adminSlice';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const admin = useAppSelector((state) => state.userReducer.user);
  const dispatch = useAppDispatch();
  const axiosWithAuth = useAxiosWithAuth();
  const { data: session, status } = useSession();

  if (session?.user.role !== 'admin' && status === 'unauthenticated') {
    redirect('/denied');
  }

  useEffect(() => {
    if (!admin && session && session.user.role === 'admin') {
      dispatch(fetchUserById({ userId: session.user.id, axiosWithAuth }));
      dispatch(fetchAccountUsers(axiosWithAuth));
    }
  }, [admin, dispatch, session, axiosWithAuth]);

  return (
    <div className="min-h-full">
      <AdminNavigation />
      <main>{children}</main>
    </div>
  );
}
