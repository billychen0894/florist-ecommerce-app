'use client';

import Button from '@components/ui/Button';
import { MobileFilterDialog } from '@components/Filter/MobileFilterDialog';
import { Filter } from '@components/Filter';
import useFilterAction from '@hooks/useFilterAction';

type FilterActionButtionProps = {
  filters: Filter[];
};
export default function FilterActionButton({
  filters,
}: FilterActionButtionProps) {
  const { setIsMobileFilterOpen } = useFilterAction();

  return (
    <>
      <MobileFilterDialog filters={filters} />
      <Button
        type="button"
        className="inline-block font-medium text-gray-700 hover:text-gray-900 bg-transparent hover:bg-transparent shadow-none sm:hidden"
        onClick={() => setIsMobileFilterOpen(true)}
      >
        <span className="text-sm font-medium text-gray-700">Filters</span>
      </Button>
    </>
  );
}
