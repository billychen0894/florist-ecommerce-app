'use client';

import useAxiosWithAuth from '@hooks/useAxiosAuth';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { redirect, usePathname } from 'next/navigation';
import { useEffect } from 'react';

import {
  fetchUserByStripeId,
  fetchUserOrders,
} from '@store/features/userSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';

const secondaryNavigation = [
  { name: 'Profile', href: '/user/profile' },
  { name: 'Orders', href: '/user/orders' },
  { name: 'Wishlist', href: '/user/wishlist' },
  { name: 'Settings', href: '/user/settings' },
];

export default function User({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  if (!session && status === 'unauthenticated') {
    redirect('/auth/signin');
  }
  const axiosWithAuth = useAxiosWithAuth();
  const user = useAppSelector((state) => state.userReducer.user);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (user?.stripeCustomerId) {
      dispatch(fetchUserByStripeId(user.stripeCustomerId));
      dispatch(
        fetchUserOrders({
          userId: session?.user.id as string,
          customerStripeId: user.stripeCustomerId,
          axiosWithAuth,
        })
      );
    }
  }, [dispatch, axiosWithAuth, session?.user.id, user?.stripeCustomerId]);

  return (
    <div className="mt-2 mx-auto max-w-7xl max-h-max">
      <main>
        <header className="border-y border-black/5">
          <nav className="flex overflow-x-auto py-4">
            <ul
              role="list"
              className="flex min-w-full gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-600 sm:px-6 lg:px-8"
            >
              {secondaryNavigation.map((item) => (
                <li key={item.name} className="hover:text-primary-300">
                  <Link
                    href={item.href}
                    className={pathname === item.href ? 'text-primary-500' : ''}
                  >
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        {children}
      </main>
    </div>
  );
}
