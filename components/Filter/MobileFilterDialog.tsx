'use client';

import { Dialog, Disclosure, Transition } from '@headlessui/react';
import { ChevronDownIcon } from '@heroicons/react/20/solid';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Dispatch, Fragment, SetStateAction } from 'react';

import Button from '@components/ui/Button';
import { cn } from '@lib/classNames';
import { type Filter } from './Filter';

interface MobileFilterDialogProps {
  isMobileFiltersOpen: boolean;
  handleMobileFiltersOpen: Dispatch<SetStateAction<boolean>>;
  filters: Filter[];
}

export function MobileFilterDialog({
  isMobileFiltersOpen,
  filters,
  handleMobileFiltersOpen,
}: MobileFilterDialogProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryFilters = searchParams.getAll('category');
  return (
    <Transition.Root show={isMobileFiltersOpen} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-40 lg:hidden"
        onClose={handleMobileFiltersOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="transition-opacity ease-linear duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity ease-linear duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-black bg-opacity-25" />
        </Transition.Child>

        <div className="fixed inset-0 z-40 flex">
          <Transition.Child
            as={Fragment}
            enter="transition ease-in-out duration-300 transform"
            enterFrom="translate-x-full"
            enterTo="translate-x-0"
            leave="transition ease-in-out duration-300 transform"
            leaveFrom="translate-x-0"
            leaveTo="translate-x-full"
          >
            <Dialog.Panel className="relative ml-auto flex h-full w-full max-w-xs flex-col overflow-y-auto bg-white py-4 pb-6 shadow-xl">
              <div className="flex items-center justify-between px-4">
                <h2 className="text-lg font-medium text-gray-900">Filters</h2>
                <Button
                  type="button"
                  className="-mr-2 flex h-10 w-10 items-center justify-center p-2 text-gray-400 hover:text-gray-500 bg-transparent hover:bg-transparent shadow-none"
                  onClick={() => handleMobileFiltersOpen(false)}
                >
                  <span className="sr-only">Close menu</span>
                  <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                </Button>
              </div>

              {/* Filters */}
              <form className="mt-4">
                {filters.map((section) => (
                  <Disclosure
                    as="div"
                    key={section.name}
                    className="border-t border-gray-200 pb-4 pt-4"
                  >
                    {({ open }) => (
                      <fieldset>
                        <legend className="w-full px-2">
                          <Disclosure.Button className="flex w-full items-center justify-between p-2 text-gray-400 hover:text-gray-500">
                            <span className="text-sm font-medium text-gray-900">
                              {section.name}
                            </span>
                            <span className="ml-6 flex h-7 items-center">
                              <ChevronDownIcon
                                className={cn(
                                  open ? '-rotate-180' : 'rotate-0',
                                  'h-5 w-5 transform'
                                )}
                                aria-hidden="true"
                              />
                            </span>
                          </Disclosure.Button>
                        </legend>
                        <Disclosure.Panel className="px-4 pb-2 pt-4">
                          <div className="space-y-6">
                            {section.options.map((option, optionIdx) => (
                              <div
                                key={option.name}
                                className="flex items-center justify-between"
                              >
                                <div>
                                  <input
                                    id={`${section.id}-${optionIdx}-mobile`}
                                    name={`${section.id}[]`}
                                    defaultValue={option.name}
                                    defaultChecked={categoryFilters.includes(
                                      option.name
                                    )}
                                    type="checkbox"
                                    onClick={(e) => {
                                      const checkbox = e.currentTarget;
                                      const optionName = checkbox.value;
                                      const isChecked = checkbox.checked;
                                      const params = new URLSearchParams(
                                        window.location.search
                                      );
                                      if (isChecked) {
                                        params.append('category', optionName);
                                      } else {
                                        const categories =
                                          params.getAll('category');
                                        params.delete('category');
                                        categories.forEach((category) => {
                                          if (category !== optionName) {
                                            params.append('category', category);
                                          }
                                        });
                                      }
                                      router.replace(
                                        `${pathname}?${params.toString()}`
                                      );
                                    }}
                                    className="h-4 w-4 rounded border-gray-300 text-secondary-500 focus:ring-secondary-400"
                                  />
                                  <label
                                    htmlFor={`${section.id}-${optionIdx}-mobile`}
                                    className="ml-3 text-sm text-gray-500"
                                  >
                                    {option.name}
                                  </label>
                                </div>
                              </div>
                            ))}
                          </div>
                        </Disclosure.Panel>
                      </fieldset>
                    )}
                  </Disclosure>
                ))}
              </form>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
