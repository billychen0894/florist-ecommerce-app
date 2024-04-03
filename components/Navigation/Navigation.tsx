import Link from '@node_modules/next/link';
import { headerNavigation } from '@const/navigation';
import AuthenticationButtons from '@components/Auth/AuthenticationButtons';
import NavCart from '@components/Navigation/NavCart';
import Search from '@components/Navigation/Search';
import { PencilSquareIcon } from '@heroicons/react/24/outline';
import Logo from '@public/images/logo.png';
import Image from 'next/image';
import { options } from '@app/api/auth/[...nextauth]/options';
import { getServerSession } from 'next-auth';
import { NavMenuContextProvider } from '@contexts/NavMenu';
import MobileMenu from './MobileMenu';
import MobileHamburger from './MobileHamburger';
import AdminPortal from './AdminPortal';

export async function Navigation() {
  return (
    <header className="relative">
      <nav
        aria-label="Top"
        className="relative z-20 bg-white bg-opacity-90 backdrop-blur-xl backdrop-filter"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center">
            <NavMenuContextProvider>
              <MobileMenu />
              <MobileHamburger />
            </NavMenuContextProvider>

            {/* Logo */}
            <div className="ml-4 lg:ml-0">
              <Link href="/" className="relative">
                <span className="sr-only">Your Company</span>
                <Image src={Logo} alt="logo" width={64} height={64} priority />
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
              <AuthenticationButtons />
              <Search />
              <NavCart />

              {/*Admin Edit Link*/}
              <AdminPortal />
            </div>
          </div>
        </div>
      </nav>
    </header>
  );
}
