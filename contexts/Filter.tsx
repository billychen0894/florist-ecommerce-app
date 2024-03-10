'use client';

import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import {
  ChangeEvent,
  Dispatch,
  SetStateAction,
  createContext,
  useCallback,
  useState,
} from 'react';

type FilterActionCtxType = {
  isMobileFilterOpen: boolean;
  setIsMobileFilterOpen: Dispatch<SetStateAction<boolean>>;
  handleFilterChange: (e: ChangeEvent<HTMLInputElement>) => void;
  categoryFilters: string[];
};

export const FilterActionCtx = createContext<FilterActionCtxType>({
  isMobileFilterOpen: false,
  setIsMobileFilterOpen: () => {},
  handleFilterChange: () => {},
  categoryFilters: [],
});

export function FilterActionCtxProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState<boolean>(false);
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const categoryFilters = searchParams.getAll('category');

  const handleFilterChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const checkbox = e.currentTarget;
      const optionName = checkbox.value;
      const isChecked = checkbox.checked;
      const params = new URLSearchParams(searchParams.toString());
      if (isChecked) {
        params.append('category', optionName);
      } else {
        params.delete('category');
        categoryFilters.forEach((category) => {
          if (category !== optionName) {
            params.append('category', category);
          }
        });
      }
      router.replace(`${pathname}?${params.toString()}`);
    },
    [searchParams, pathname, router, categoryFilters]
  );

  return (
    <FilterActionCtx.Provider
      value={{
        isMobileFilterOpen,
        setIsMobileFilterOpen,
        handleFilterChange,
        categoryFilters,
      }}
    >
      {children}
    </FilterActionCtx.Provider>
  );
}
