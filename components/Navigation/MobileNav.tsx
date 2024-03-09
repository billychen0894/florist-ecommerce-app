'use client';

import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import Link from 'next/link';
import { Fragment, useContext } from 'react';
import Button from '@components/ui/Button';
import { headerNavigation } from '@const/navigation';
import { useSession } from 'next-auth/react';
import useNavMenuCtx from '@hooks/useNavMenuCtx';
import { Bars3Icon } from '@node_modules/@heroicons/react/24/outline';
import { createContext, Dispatch, SetStateAction, useState } from 'react';

const mobileUserAccountMenu = [
  { href: '/user/profile', label: 'Profile' },
  { href: '/user/orders', label: 'Manage Orders' },
  { href: '/user/settings', label: 'Settings' },
];

interface NavMenuContextType {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export const NavMenuContext = createContext<NavMenuContextType>({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: () => null,
} as NavMenuContextType);

export function MobileNav({ children }: { children: React.ReactNode }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navMenuContext = {
    isMobileMenuOpen,
    setIsMobileMenuOpen,
  };

  return (
    <NavMenuContext.Provider value={navMenuContext}>
      {children}
    </NavMenuContext.Provider>
  );
}

function Menu() {
  const navMenuCtx = useContext(NavMenuContext);
  const { data: session, status } = useSession();
  const MobileUserAccountMenu = (
    <>
      {mobileUserAccountMenu.map((item) => (
        <div key={item.href} className="flow-root">
          <Link
            href={item.href}
            className="-m-2 block p-2 font-medium text-gray-900 hover:text-secondary-500"
            onClick={() => navMenuCtx.setIsMobileMenuOpen(false)}
          >
            {item.label}
          </Link>
        </div>
      ))}
      <div className="flow-root">
        <span
          onClick={async () => {
            navMenuCtx.setIsMobileMenuOpen(false);
            const { signOut } = await import('next-auth/react');
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
    <Transition.Root show={navMenuCtx.isMobileMenuOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={navMenuCtx.setIsMobileMenuOpen}
      >
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
                  onClick={() => navMenuCtx.setIsMobileMenuOpen(false)}
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
                      onClick={() => navMenuCtx.setIsMobileMenuOpen(false)}
                    >
                      {page.name}
                    </Link>
                  </div>
                ))}
              </div>

              <div className="space-y-6 border-t border-gray-200 px-4 py-6">
                {/*<AuthenticationButtons />*/}
                <div className="flow-root">
                  <span
                    onClick={async () => {
                      const { signIn } = await import('next-auth/react');
                      signIn();
                    }}
                    className="-m-2 block p-2 font-medium text-gray-900 hover:text-secondary-500 cursor-pointer"
                  >
                    Sign in
                  </span>
                </div>
                <div className="flow-root">
                  <Link
                    href={{ pathname: '/auth/signup' }}
                    className="-m-2 block p-2 font-medium text-gray-900 hover:text-secondary-500"
                    onClick={() => navMenuCtx.setIsMobileMenuOpen(false)}
                  >
                    Create account
                  </Link>
                </div>
                {session && status === 'authenticated' && MobileUserAccountMenu}
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}

function Hamburger() {
  const navMenuCtx = useContext(NavMenuContext);

  return (
    <Button
      type="button"
      className=" bg-white hover:bg-transparent shadow-none p-2 text-gray-400 lg:hidden"
      onClick={() => {
        navMenuCtx.setIsMobileMenuOpen(true);
      }}
    >
      <span className="sr-only">Open menu</span>
      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
    </Button>
  );
}
MobileNav.Menu = Menu;
MobileNav.Hamburger = Hamburger;
