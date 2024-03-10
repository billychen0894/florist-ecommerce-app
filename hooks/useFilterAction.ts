'use client';

import { FilterActionCtx } from '@contexts/Filter';
import { useContext } from 'react';

export default function useFilterAction() {
  const filterActionCtx = useContext(FilterActionCtx);

  if (filterActionCtx === null) {
    throw new Error('useFilterAction must be inside FilterActionCtx provider.');
  }

  return filterActionCtx;
}
