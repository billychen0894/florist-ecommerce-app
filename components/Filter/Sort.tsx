'use client';

import { Menu, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { Fragment, useCallback, useMemo } from 'react';

import { productSortOptions } from '@/const/products';
import { cn } from '@/lib/classNames';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';

export function Sort() {
  const searchParams = useSearchParams();
  const sortParams = searchParams.get('sort');
  const router = useRouter();
  const pathname = usePathname();

  const getCurrSortLabel = useMemo(() => {
    if (sortParams) {
      const sortLabel = productSortOptions.find((option) => {
        return option.href === sortParams;
      });
      return sortLabel ? sortLabel.name : '';
    }
  }, [sortParams]);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set(name, value);
      return params.toString();
    },
    [searchParams]
  );

  return (
    <Menu as="div" className="relative inline-block text-left">
      <div>
        <Menu.Button className="group inline-flex justify-center text-sm font-medium text-gray-700 hover:text-gray-900">
          Sort
          {sortParams && (
            <span className="text-gray-500">: {getCurrSortLabel}</span>
          )}
          <ChevronDownIcon
            className="-mr-1 ml-1 h-5 w-5 flex-shrink-0 text-gray-400 group-hover:text-gray-500"
            aria-hidden="true"
          />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute left-0 z-10 mt-2 w-40 origin-top-left rounded-md bg-white shadow-2xl ring-1 ring-black ring-opacity-5 focus:outline-none">
          <div className="py-1">
            {productSortOptions.map((option) => (
              <Menu.Item key={option.name}>
                {({ active }) => (
                  <button
                    type="button"
                    className={cn(
                      active ? 'bg-gray-100' : '',
                      'block px-4 py-2 text-sm font-medium text-gray-900 w-full text-left'
                    )}
                    onClick={() => {
                      router.push(
                        `${pathname}?${createQueryString('sort', option.href)}`
                      );
                    }}
                  >
                    {option.name}
                  </button>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  );
}
