'use client';

import { NavMenuContext } from '@/contexts/NavMenu';
import { useContext } from 'react';

export default function useNavMenuCtx() {
  const navMenuCtx = useContext(NavMenuContext);

  if (navMenuCtx === null) {
    throw new Error('useNavMenuCtx must be inside NavMenuContext provider.');
  }

  return navMenuCtx;
}
