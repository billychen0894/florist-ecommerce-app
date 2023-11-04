'use client';

import { useContext } from 'react';
import { NavMenuContext } from '@contexts/NavMenu';

export default function useNavMenuCtx() {
  const navMenuCtx = useContext(NavMenuContext);

  if (navMenuCtx === null) {
    throw new Error('useNavMenuCtx must be inside NavMenuContext provider.');
  }

  return navMenuCtx;
}
