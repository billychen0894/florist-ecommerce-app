'use client';

import Button from '@components/ui/Button';
import { MagnifyingGlassIcon } from '@heroicons/react/20/solid';
import { Input } from '@components/ui';
import { useRouter } from 'next/navigation';

interface ProductListProps {
  list?: JSX.Element[];
  btnLabel: string;
  btnUrl: string;
  isSearch: boolean;
}

export default function AdminList({
  list,
  btnLabel,
  isSearch,
  btnUrl,
}: ProductListProps) {
  const router = useRouter();

  return (
    <>
      <nav className="scroll-smooth px-2" aria-label="ProductsList">
        <div className="flex justify-end items-center">
          <Button
            type="button"
            onClick={() => {
              router.push(btnUrl);
            }}
          >
            {btnLabel}
          </Button>
        </div>
        {isSearch && (
          <form className="my-6 py-px flex gap-x-4 sticky top-1" action="#">
            <div className="min-w-0 flex-1">
              <label htmlFor="search" className="sr-only">
                Search
              </label>
              <div className="relative rounded-md shadow-sm">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <MagnifyingGlassIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </div>
                <Input
                  type="search"
                  name="search"
                  id="search"
                  placeholder="Search with product name"
                  className="py-1.5 pl-10 placeholder:text-gray-400 sm:text-sm sm:leading-6"
                />
              </div>
            </div>
          </form>
        )}
        <ul role="list" className="divide-y divide-gray-100 mt-2">
          {list}
        </ul>
      </nav>
    </>
  );
}
