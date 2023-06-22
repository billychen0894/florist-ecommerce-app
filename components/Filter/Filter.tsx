'use client';

import { ProductCategory, productCategories } from '@const/products';
import { PlusIcon } from '@heroicons/react/20/solid';
import { useState } from 'react';
import { MobileFilterDialog } from './MobileFilterDialog';

export interface Filter {
  id: string;
  name: string;
  options: ProductCategory[];
}

const filters: Filter[] = [
  {
    id: 'category',
    name: 'Category',
    options: productCategories,
  },
];

export function Filter() {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);

  return (
    <>
      <MobileFilterDialog
        isMobileFiltersOpen={mobileFiltersOpen}
        handleMobileFiltersOpen={setMobileFiltersOpen}
        filters={filters}
      />

      <aside>
        <h2 className="sr-only">Filters</h2>
        {/* Mobile Filter */}
        <button
          type="button"
          className="inline-flex items-center lg:hidden"
          onClick={() => setMobileFiltersOpen(true)}
        >
          <span className="text-sm font-medium text-gray-700">Filters</span>
          <PlusIcon
            className="ml-1 h-5 w-5 flex-shrink-0 text-gray-400"
            aria-hidden="true"
          />
        </button>

        {/* Desktop Filter */}
        <div className="hidden lg:block">
          <form className="space-y-10 divide-y divide-gray-200">
            {filters.map((section, sectionIdx) => (
              <div
                key={section.name}
                className={sectionIdx === 0 ? undefined : 'pt-10'}
              >
                <fieldset>
                  <legend className="block text-sm font-medium text-gray-900">
                    {section.name}
                  </legend>
                  <div className="space-y-3 pt-6">
                    {section.options.map((option, optionIdx) => (
                      <div
                        key={option.name}
                        className="flex items-center justify-between"
                      >
                        <div>
                          <input
                            id={`${section.id}-${optionIdx}`}
                            name={`${section.id}[]`}
                            defaultValue={option.name}
                            type="checkbox"
                            className="h-4 w-4 rounded border-gray-300 text-secondary-500 focus:ring-secondary-400"
                          />

                          <label
                            htmlFor={`${section.id}-${optionIdx}`}
                            className="ml-3 text-sm text-gray-600"
                          >
                            {option.name}
                          </label>
                        </div>
                        <span className="ml-3 text-sm text-gray-600">
                          {option.products.length}
                        </span>
                      </div>
                    ))}
                  </div>
                </fieldset>
              </div>
            ))}
          </form>
        </div>
      </aside>
    </>
  );
}
