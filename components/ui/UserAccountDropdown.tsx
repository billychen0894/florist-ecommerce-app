import { Menu, Transition } from '@headlessui/react';
import { cn } from '@lib/classNames';
import { signOut } from 'next-auth/react';
import { Fragment } from 'react';
import Button from './Button';

interface UserAcccountDropdownProps {
  email: string;
  avatar: JSX.Element | null;
}

export default function UserAcccountDropdown({
  avatar,
  email,
}: UserAcccountDropdownProps) {
  return (
    <Menu as="span" className="hidden relative sm:inline-block text-left">
      <div className="relative top-0.5">
        <Menu.Button className="inline-block h-6 w-6 sm:h-7 sm:w-7 overflow-hidden rounded-full bg-gray-100">
          {avatar}
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="px-4 py-3">
            <p className="text-sm">Signed in as</p>
            <p className="truncate text-sm font-medium text-gray-900">
              {email}
            </p>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/user/profile"
                  className={cn(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Profile
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/user/orders"
                  className={cn(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Manage Orders
                </a>
              )}
            </Menu.Item>
            <Menu.Item>
              {({ active }) => (
                <a
                  href="/user/settings"
                  className={cn(
                    active ? 'bg-gray-100 text-gray-900' : 'text-gray-700',
                    'block px-4 py-2 text-sm'
                  )}
                >
                  Settings
                </a>
              )}
            </Menu.Item>
          </div>
          <div className="py-1">
            <Menu.Item>
              {({ active }) => (
                <Button
                  type="button"
                  className={cn(
                    active ? 'bg-gray-100 text-red-500' : 'text-red-600',
                    'block w-full px-4 py-2 text-left bg-transparent hover:bg-transparent shadow-none font-normal'
                  )}
                  onClick={() => signOut()}
                >
                  Sign out
                </Button>
              )}
            </Menu.Item>
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
