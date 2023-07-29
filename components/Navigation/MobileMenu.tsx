import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment } from 'react';

import AuthenticationButtons from '@components/Auth/AuthenticationButtons';
import Button from '@components/ui/Button';
import { headerNavigation } from '@const/navigation';
import { signOut, useSession } from 'next-auth/react';

interface MobileMenuProps {
  isOpen: boolean;
  onOpen: (open: boolean) => void;
  isMobile?: boolean;
}

export default function MobileMenu({
  isOpen,
  onOpen,
  isMobile,
}: MobileMenuProps) {
  const { data: session, status } = useSession();
  const MobileUserAccountMenu = (
    <>
      <div className="flow-root">
        <Link
          href="/account"
          className="-m-2 block p-2 font-medium text-gray-900 hover:text-secondary-500"
          onClick={() => onOpen(false)}
        >
          Account
        </Link>
      </div>
      <div className="flow-root">
        <Link
          href="/orders"
          className="-m-2 block p-2 font-medium text-gray-900 hover:text-secondary-500"
          onClick={() => onOpen(false)}
        >
          Manage Orders
        </Link>
      </div>
      <div className="flow-root">
        <Link
          href="/orders"
          className="-m-2 block p-2 font-medium text-gray-900 hover:text-secondary-500"
          onClick={() => onOpen(false)}
        >
          Settings
        </Link>
      </div>
      <div className="flow-root">
        <span
          onClick={() => {
            onOpen && onOpen(false);
            signOut();
          }}
          className="-m-2 block p-2 font-medium text-red-500 hover:text-red-600 cursor-pointer"
        >
          Sign Out
        </span>
      </div>
    </>
  );

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-40 lg:hidden" onClose={onOpen}>
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="-translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="-translate-x-full"
          >
            <Dialog.Panel className="relative flex w-full max-w-xs flex-col overflow-y-auto bg-white pb-12 shadow-xl">
              <div className="flex px-4 pb-2 pt-5">
                <Button
                  type="button"
                  className="-m-2 inline-flex items-center justify-center p-2 text-gray-400 bg-transparent hover:bg-transparent shadow-none"
                  onClick={() => onOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </Button>
              </div>
              {/* Links */}
              <div className="space-y-6 px-4 py-6">
                {headerNavigation.pages.map((page) => (
                  <div key={page.name} className="flow-root">
                    <Link
                      href={page.href}
                      className="-m-2 block p-2 font-medium text-gray-900 hover:text-secondary-500"
                      onClick={() => onOpen(false)}
                    >
                      {page.name}
                    </Link>
                  </div>
                ))}
              </div>

              <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                {isMobile && (
                  <AuthenticationButtons isMobile={isMobile} onOpen={onOpen} />
                )}
                {session && status === 'authenticated' && MobileUserAccountMenu}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
