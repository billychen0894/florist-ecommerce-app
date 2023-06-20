import Link from 'next/link';

import { type Page } from '@const/navigation';

interface FooterItemProps {
  pageTitle: string;
  pages: Page[];
}

export function FooterItem({ pages, pageTitle }: FooterItemProps) {
  return (
    <>
      <h3 className="text-sm font-semibold leading-6 text-black">
        {pageTitle}
      </h3>
      <ul role="list" className="mt-6 space-y-4">
        {pages.map((page) => (
          <li key={page.name}>
            <Link
              href={page.href}
              className="text-sm leading-6 text-gray-600 hover:text-gray-900"
            >
              {page.name}
            </Link>
          </li>
        ))}
      </ul>
    </>
  );
}
