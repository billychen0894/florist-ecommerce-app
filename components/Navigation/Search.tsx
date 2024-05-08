'use client';

import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useState } from 'react';

export default function Search() {
  const [open, setOpen] = useState<boolean>(false);
  const SearchWindow = dynamic(() => import('@/components/ui/SearchWindow'));

  return (
    <>
      <SearchWindow open={open} onOpen={setOpen} />
      <div className="ml-4 flow-root lg:ml-6">
        <Link
          href="#"
          className="p-2 text-gray-400 hover:text-secondary-500"
          onClick={() => {
            setOpen(true);
          }}
          data-cy="header-search"
        >
          <span className="sr-only">Search</span>
          <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
