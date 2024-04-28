'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';

import { adminMenuItems } from '@/components/Admin/AdminNavigation';
import { Avatar } from '@/components/ui';
import UserAccountDropdown from '@/components/ui/UserAccountDropdown';

export const userMenuItems = [
  { href: '/user/profile', label: 'Profile' },
  { href: '/user/orders', label: 'Orders' },
  { href: '/user/wishlist', label: 'Wishlist' },
  { href: '/user/settings', label: 'Settings' },
];

function AuthenticationButtons() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return null;
  }

  if (session && status === 'authenticated') {
    return (
      <UserAccountDropdown
        email={session?.user.email as string}
        avatar={
          <Avatar
            avatarImageUrl={session?.user?.image!}
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
        onClick={async () => {
          const { signIn } = await import('next-auth/react');
          signIn();
        }}
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
