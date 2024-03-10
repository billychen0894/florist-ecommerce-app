'use client';

import { usePathname } from 'next/navigation';
import { useMemo } from 'react';

import capitalizeWords from '@lib/capitalizeWords';
import { Crumb } from './Crumb';

interface Crumb {
  href: string;
  crumbName: string;
}

export function Breadcrumb() {
  const pathname = usePathname();

  // Memoize the function to prevent unnecessary re-renders
  const crumbList = useMemo((): Crumb[] => {
    const breadcrumbList: Crumb[] = [{ href: '/', crumbName: 'Home' }];
    // Accessing the current pathname from URL then split it into segments
    // Filter out empty segments
    const segments: string[] = pathname
      .split('/')
      .filter((segment) => segment !== '');

    // Reduce the segments into a single string
    segments.reduce((prev, curr) => {
      const href = `${prev}/${curr}`;

      // Decode the URI encoded string for Non-ASCII characters due to URL only accepts ASCII characters
      const decodedText = decodeURIComponent(
        curr === 'products' ? 'Product' : curr
      );
      // Push the segments into breadcrumbList
      breadcrumbList.push({ href, crumbName: capitalizeWords(decodedText) });
      return href;
    }, '');

    return breadcrumbList;
  }, [pathname]);

  return (
    <nav
      aria-label="Breadcrumb"
      className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"
    >
      <ol role="list" className="flex items-center space-x-4 py-4">
        {/* Map through CrumbList to dynamically generate Crumbs */}
        {crumbList.map((crumb, index) => (
          <Crumb
            key={crumb.href}
            href={crumb.href}
            crumbName={crumb.crumbName}
            last={index === crumbList.length - 1}
          />
        ))}
      </ol>
    </nav>
  );
}
