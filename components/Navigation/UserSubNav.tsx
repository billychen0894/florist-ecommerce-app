'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const secondaryNavigation = [
  { name: 'Profile', href: '/user/profile' },
  { name: 'Orders', href: '/user/orders' },
  { name: 'Wishlist', href: '/user/wishlist' },
  { name: 'Settings', href: '/user/settings' },
];

export default function UserSubNav() {
  const pathname = usePathname();

  return (
    <nav className="flex overflow-x-auto py-4">
      <ul
        role="list"
        className="flex min-w-full gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-600 sm:px-6 lg:px-8"
        data-cy="user-subnav"
      >
        {secondaryNavigation.map((item) => (
          <li key={item.name} className="hover:text-primary-300">
            <Link
              href={item.href}
              className={pathname === item.href ? 'text-primary-500' : ''}
              data-cy={`user-subnav-${item.name}`}
            >
              {item.name}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
