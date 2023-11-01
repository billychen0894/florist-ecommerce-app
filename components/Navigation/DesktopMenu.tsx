'use client';

import {
  Bars3Icon,
  MagnifyingGlassIcon,
  PencilSquareIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

import AuthenticationButtons from '@components/Auth/AuthenticationButtons';
import Button from '@components/ui/Button';
import { headerNavigation } from '@const/navigation';
import { cn } from '@lib/classNames';
import { getCartItemsFromLocalStorage } from '@lib/getCartItemsFromLocalStorage';
import { initializeCart } from '@store/features/cartSlice';
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { useEffect, useState } from 'react';
import SearchWindow from '@components/ui/SearchWindow';
import { useSession } from 'next-auth/react';

interface DesktopMenuProps {
  onOpen: (open: boolean) => void;
  isOpen: boolean;
  isMobile?: boolean;
}

export default function DesktopMenu({
  onOpen,
  isOpen,
  isMobile,
}: DesktopMenuProps) {
  const dispatch = useAppDispatch();
  const { data: session, status } = useSession();
  useEffect(() => {
    if (typeof window !== undefined) {
      const cachedCartItems = getCartItemsFromLocalStorage();
      dispatch(initializeCart(cachedCartItems));
    }
  }, [dispatch]);
  const [isSearchWindowOpen, setIsSearchWindowOpen] = useState<boolean>(false);

  const cartItems = useAppSelector((state) => state.cartReducer.cartItems);
  const cartItemsArr = Object.values(cartItems);

  return (
    <>
      <SearchWindow open={isSearchWindowOpen} onOpen={setIsSearchWindowOpen} />
      <header className="relative">
        {/* Top navigation */}
        <nav
          aria-label="Top"
          className="relative z-20 bg-white bg-opacity-90 backdrop-blur-xl backdrop-filter"
        >
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="flex h-16 items-center">
              {/* Hamburger Menu Icon */}
              <Button
                type="button"
                className=" bg-white hover:bg-transparent shadow-none p-2 text-gray-400 lg:hidden"
                onClick={() => onOpen(true)}
              >
                <span className="sr-only">Open menu</span>
                <Bars3Icon className="h-6 w-6" aria-hidden="true" />
              </Button>

              {/* Logo */}
              <div className="ml-4 flex lg:ml-0">
                <Link href="/">
                  <span className="sr-only">Your Company</span>
                  <Image
                    className="h-16 w-auto"
                    src="/images/logo.png"
                    alt="logo"
                    width={100}
                    height={100}
                  />
                </Link>
              </div>

              {/* Menu */}
              <div className="hidden lg:ml-8 lg:block lg:self-stretch">
                <div className="flex h-full space-x-8">
                  {headerNavigation.pages.map((page) => (
                    <Link
                      key={page.name}
                      href={page.href}
                      className="flex items-center text-sm font-medium text-gray-700 hover:text-secondary-500"
                    >
                      {page.name}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="ml-auto flex items-center">
                {!isMobile && <AuthenticationButtons isMobile={isMobile} />}

                {/* Search */}
                <div className="ml-4 flow-root lg:ml-6">
                  <Link
                    href="#"
                    className="p-2 text-gray-400 hover:text-secondary-500"
                    onClick={() => {
                      setIsSearchWindowOpen(true);
                    }}
                  >
                    <span className="sr-only">Search</span>
                    <MagnifyingGlassIcon
                      className="h-6 w-6"
                      aria-hidden="true"
                    />
                  </Link>
                </div>

                {/* Cart */}
                <div className="ml-4 flow-root lg:ml-6 relative">
                  <Link
                    href="/cart"
                    className="group -m-2 flex items-center p-2"
                  >
                    <ShoppingBagIcon
                      className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-secondary-500"
                      aria-hidden="true"
                    />
                    <span
                      className={cn(
                        'text-xs font-medium text-gray-700 group-hover:text-gray-800 absolute top-1 right-0.5 transfrom translate-x-1/2 -translate-y-1/2 text-center',
                        `${
                          cartItemsArr.length > 0
                            ? 'text-white rounded-full bg-red-500 group-hover:text-white h-4 w-4'
                            : null
                        }`,
                        `${cartItemsArr.length >= 10 ? 'text-[10px]' : null}`
                      )}
                    >
                      {cartItemsArr.length > 0 ? cartItemsArr.length : null}
                    </span>
                    <span className="sr-only">items in cart, view bag</span>
                  </Link>
                </div>
                {/*Admin Edit Link*/}
                {session &&
                  session.user.role === 'admin' &&
                  status === 'authenticated' && (
                    <div className="ml-4 flow-root lg:ml-6 relative">
                      <Link
                        href="/admin/dashboard"
                        className="group -m-2 flex items-center p-2"
                      >
                        <PencilSquareIcon
                          className="h-6 w-6 flex-shrink-0 text-red-500 group-hover:text-red-400"
                          aria-hidden="true"
                        />
                        <span className="sr-only">Admin Edit</span>
                      </Link>
                    </div>
                  )}
              </div>
            </div>
          </div>
        </nav>
      </header>
    </>
  );
}
