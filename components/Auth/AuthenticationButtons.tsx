'use client';

import { signIn, useSession } from 'next-auth/react';
import Link from 'next/link';
import dynamic from 'next/dynamic';

import { Avatar } from '@components/ui';
import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { fetchUserById } from '@store/features/userSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect } from 'react';
import { adminMenuItems } from '@components/Admin/AdminNavigation';

export const userMenuItems = [
  { href: '/user/profile', label: 'Profile' },
  { href: '/user/orders', label: 'Orders' },
  { href: '/user/wishlist', label: 'Wishlist' },
  { href: '/user/settings', label: 'Settings' },
];

function AuthenticationButtons() {
  const UserAccountDropdown = dynamic(
    () => import('@components/ui/UserAccountDropdown'),
    { ssr: false }
  );

  const { data: session, status } = useSession();
  const user = useAppSelector((state) => state.userReducer.user);
  const dispatch = useAppDispatch();
  const axiosWithAuth = useAxiosWithAuth();

  useEffect(() => {
    if (session && status === 'authenticated') {
      dispatch(
        fetchUserById({ userId: session?.user.id as string, axiosWithAuth })
      );
    }
  }, [axiosWithAuth, dispatch, session, status]);

  if (session && status === 'authenticated') {
    return (
      <UserAccountDropdown
        email={session?.user.email as string}
        avatar={
          <Avatar
            avatarImageUrl={user?.image!}
            avatarImageAlt={session?.user.name || 'user avatar'}
          />
        }
        menuItems={
          session?.user.role === 'user' ? userMenuItems : adminMenuItems
        }
      />
    );
  }

  return (
    <div
      className={
        'hidden sm:flex sm:flex-1 sm:items-center sm:justify-end sm:space-x-6'
      }
    >
      <span
        onClick={() => signIn()}
        className="text-sm font-medium text-gray-700 hover:text-secondary-500 cursor-pointer"
      >
        Sign in
      </span>
      <span className="h-6 w-px bg-gray-200" aria-hidden="true" />
      <Link
        href={{ pathname: '/auth/signup' }}
        className="text-sm font-medium text-gray-700 hover:text-secondary-500"
      >
        Create account
      </Link>
    </div>
  );
}

export default AuthenticationButtons;
