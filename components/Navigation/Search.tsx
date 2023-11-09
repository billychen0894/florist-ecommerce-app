'use client';

import Link from '@node_modules/next/link';
import { MagnifyingGlassIcon } from '@node_modules/@heroicons/react/24/outline';
import { useState } from 'react';
import dynamic from 'next/dynamic';

export default function Search() {
  const [open, setOpen] = useState<boolean>(false);
  const SearchWindow = dynamic(() => import('@components/ui/SearchWindow'));

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
        >
          <span className="sr-only">Search</span>
          <MagnifyingGlassIcon className="h-6 w-6" aria-hidden="true" />
        </Link>
      </div>
    </>
  );
}
