'use client';

import Image from 'next/image';
import { Disclosure } from '@node_modules/@headlessui/react';
import { cn } from '@lib/classNames';
import {
  Bars3Icon,
  BuildingStorefrontIcon,
  XMarkIcon,
} from '@node_modules/@heroicons/react/24/outline';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import capitalizeWords from '@lib/capitalizeWords';
import UserAcccountDropdown from '@components/ui/UserAccountDropdown';
import { Avatar } from '@components/ui';
import { useSession } from 'next-auth/react';
import { useAppSelector } from '@store/hooks';

const navigation = [
  { name: 'Dashboard', href: '/admin/dashboard' },
  { name: 'Orders', href: '/admin/orders' },
  { name: 'Products', href: '/admin/products' },
  { name: 'Customers', href: '/admin/customers' },
  { name: 'Settings', href: '/admin/settings' },
];

export const adminMenuItems = [
  { label: 'Your Profile', href: '/admin/profile' },
  { label: 'Account Settings', href: '/admin/account-settings' },
];

export default function AdminNavigation() {
  const { data: session } = useSession();
  const admin = useAppSelector((state) => state.userReducer.user);
  const pathname = usePathname();
  const pathnameParts = pathname.split('/');
  const currentPageName = pathnameParts[pathnameParts.length - 1];

  return (
    <>
      <div className="min-h-full">
        <Disclosure as="nav" className="bg-primary-300">
          {({ open }) => (
            <>
              <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                  <div className="flex items-center">
                    <div className="flex-shrink-0">
                      {/*Logo*/}
                      <Image
                        className="h-16 w-auto"
                        src="/images/logo.png"
                        alt="logo"
                        width={500}
                        height={500}
                      />
                    </div>
                    <div className="hidden md:block">
                      <div className="ml-10 flex items-baseline space-x-4">
                        {navigation.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className={cn(
                              pathname === item.href
                                ? 'bg-primary-500 text-white'
                                : 'text-white hover:bg-primary-500 hover:bg-opacity-75',
                              'rounded-md px-3 py-2 text-sm font-medium'
                            )}
                            aria-current={
                              pathname === item.href ? 'page' : undefined
                            }
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="ml-4 flex items-center md:ml-6">
                      {/* Profile dropdown */}
                      <div className="flex justify-center items-center gap-4">
                        <UserAcccountDropdown
                          email={session?.user.email as string}
                          avatar={
                            <Avatar
                              avatarImageUrl={admin?.image!}
                              avatarImageAlt={
                                session?.user.name || 'user avatar'
                              }
                            />
                          }
                          menuItems={adminMenuItems}
                        />
                        {/*  Link back to store*/}
                        <Link
                          href="/"
                          className="group -m-2 flex items-center p-2"
                        >
                          <BuildingStorefrontIcon
                            className="h-6 w-6 flex-shrink-0 text-secondary-500 group-hover:text-secondary-400"
                            aria-hidden="true"
                          />
                          <span className="sr-only">Store Front</span>
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="-mr-2 flex md:hidden">
                    {/* Mobile menu button */}
                    <Disclosure.Button className="relative inline-flex items-center justify-center rounded-md bg-indigo-600 p-2 text-indigo-200 hover:bg-indigo-500 hover:bg-opacity-75 hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-indigo-600">
                      <span className="absolute -inset-0.5" />
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Disclosure.Button>
                  </div>
                </div>
              </div>
            </>
          )}
        </Disclosure>
      </div>
      <header className="bg-white shadow">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <h1 className="text-3xl font-bold leading-tight tracking-tight text-gray-900">
            {capitalizeWords(currentPageName)}
          </h1>
        </div>
      </header>
    </>
  );
}