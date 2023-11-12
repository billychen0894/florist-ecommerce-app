'use client';

import Button from '@components/ui/Button';
import { MobileFilterDialog } from '@components/Filter/MobileFilterDialog';
import { useState } from 'react';
import { Filter } from '@components/Filter';

type FilterActionButtionProps = {
  filters: Filter[];
};
export default function FilterActionButton({
  filters,
}: FilterActionButtionProps) {
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState<boolean>(false);
  return (
    <>
      <MobileFilterDialog
        isMobileFiltersOpen={mobileFiltersOpen}
        handleMobileFiltersOpen={setMobileFiltersOpen}
        filters={filters}
      />
      <Button
        type="button"
        className="inline-block font-medium text-gray-700 hover:text-gray-900 bg-transparent hover:bg-transparent shadow-none sm:hidden"
        onClick={() => setMobileFiltersOpen(true)}
      >
        <span className="text-sm font-medium text-gray-700">Filters</span>
      </Button>
    </>
  );
}
