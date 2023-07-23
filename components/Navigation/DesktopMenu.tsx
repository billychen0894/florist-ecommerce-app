import {
  Bars3Icon,
  MagnifyingGlassIcon,
  ShoppingBagIcon,
} from '@heroicons/react/24/outline';
import Image from 'next/image';
import Link from 'next/link';

import AuthenticationButtons from '@components/Auth/AuthenticationButtons';
import { headerNavigation } from '@const/navigation';

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
  return (
    <header className="relative">
      {/* Top navigation */}
      <nav
        aria-label="Top"
        className="relative z-20 bg-white bg-opacity-90 backdrop-blur-xl backdrop-filter"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            {/* Hamburger Menu Icon */}
            <button
              type="button"
              className="rounded-md bg-white p-2 text-gray-400 lg:hidden"
              onClick={() => onOpen(true)}
            >
              <span className="sr-only">Open menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>

            {/* Logo */}
            <div className="ml-4 flex lg:ml-0">
              <Link href="/">
                <span className="sr-only">Your Company</span>
                <Image
                  className="h-16 w-auto"
                  src="/images/logo.png"
                  alt="logo"
                  width={500}
                  height={500}
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
                >
                  <span className="sr-only">Search</span>
                  <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
                </Link>
              </div>

              {/* Cart */}
              <div className="ml-4 flow-root lg:ml-6">
                <Link href="/cart" className="group -m-2 flex items-center p-2">
                  <ShoppingBagIcon
                    className="h-6 w-6 flex-shrink-0 text-gray-400 group-hover:text-secondary-500"
                    aria-hidden="true"
                  />
                  <span className="ml-2 text-sm font-medium text-gray-700 group-hover:text-gray-800">
                    0
                  </span>
                  <span className="sr-only">items in cart, view bag</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
