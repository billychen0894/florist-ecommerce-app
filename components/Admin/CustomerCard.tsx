import Image from 'next/image';
import { User } from '@lib/types/api';
import { Menu, Transition } from '@headlessui/react';
import { Fragment } from 'react';
import { cn } from '@lib/classNames';
import { EllipsisHorizontalIcon } from '@heroicons/react/20/solid';
import Link from 'next/link';

type CustomerCardProps = {
  customer: User;
};

const defualtAvatar = (
  <div className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-700/10 overflow-hidden">
    <svg className="text-gray-300" fill="currentColor" viewBox="0 0 24 24">
      <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
    </svg>
  </div>
);

export default function CustomerCard({ customer }: CustomerCardProps) {
  return (
    <li
      key={customer?.id}
      className="overflow-hidden rounded-xl border border-gray-200"
    >
      <div className="flex items-center gap-x-4 border-b border-gray-900/5 bg-secondary-100/20 p-6">
        {customer?.image ? (
          <Image
            src={customer?.image || ''}
            alt="customer avatar"
            className="h-12 w-12 flex-none rounded-lg bg-white object-cover ring-1 ring-gray-900/10"
            width={50}
            height={50}
          />
        ) : (
          defualtAvatar
        )}
        <div>
          <div className="text-sm font-medium leading-6 text-gray-900">
            {customer?.name}
          </div>
          <div className="text-xs font-normal leading-6 text-gray-500">
            {customer?.email}
          </div>
        </div>
        <Menu as="div" className="relative ml-auto">
          <Menu.Button className="-m-2.5 block p-2.5 text-gray-400 hover:text-gray-500">
            <span className="sr-only">Open options</span>
            <EllipsisHorizontalIcon className="h-5 w-5" aria-hidden="true" />
          </Menu.Button>
          <Transition
            as={Fragment}
            enter="transition ease-out duration-100"
            enterFrom="transform opacity-0 scale-95"
            enterTo="transform opacity-100 scale-100"
            leave="transition ease-in duration-75"
            leaveFrom="transform opacity-100 scale-100"
            leaveTo="transform opacity-0 scale-95"
          >
            <Menu.Items className="absolute right-0 z-10 mt-0.5 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 focus:outline-none">
              <Menu.Item>
                {({ active }) => (
                  <Link
                    href={`/admin/customers/${customer?.id}/orders`}
                    className={cn(
                      active ? 'bg-gray-50' : '',
                      'block px-3 py-1 text-sm leading-6 text-gray-900'
                    )}
                  >
                    Order history
                    <span className="sr-only">, {customer.name}</span>
                  </Link>
                )}
              </Menu.Item>
              <Menu.Item>
                {({ active }) => (
                  <button
                    onClick={() => {
                      //   TODO: Delete User
                    }}
                    className={cn(
                      active ? 'bg-gray-50' : '',
                      'text-left w-full px-3 py-1 text-sm leading-6 text-red-500'
                    )}
                  >
                    Delete<span className="sr-only">, {customer.name}</span>
                  </button>
                )}
              </Menu.Item>
            </Menu.Items>
          </Transition>
        </Menu>
      </div>
      <dl className="-my-3 divide-y divide-gray-100 px-6 py-3 text-sm leading-6">
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Phone</dt>
          <dd className="text-gray-700">
            <span>{customer?.phone || 'unspecified'}</span>
          </dd>
        </div>
        <div className="flex justify-between gap-x-4 py-3">
          <dt className="text-gray-500">Join</dt>
          <dd className="text-gray-700">
            <time dateTime={new Date(customer?.createdAt).toLocaleDateString()}>
              {new Date(customer?.createdAt).toLocaleDateString()}
            </time>
          </dd>
        </div>
      </dl>
    </li>
  );
}
