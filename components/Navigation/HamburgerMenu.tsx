'use client';

import Button from '@components/ui/Button';
import { Bars3Icon } from '@node_modules/@heroicons/react/24/outline';
import useNavMenuCtx from '@hooks/useNavMenuCtx';

export default function HamburgerMenu() {
  const navMenuCtx = useNavMenuCtx();

  return (
    <Button
      type="button"
      className=" bg-white hover:bg-transparent shadow-none p-2 text-gray-400 lg:hidden"
      onClick={() => {
        navMenuCtx.setIsMobileMenuOpen(true);
      }}
    >
      <span className="sr-only">Open menu</span>
      <Bars3Icon className="h-6 w-6" aria-hidden="true" />
    </Button>
  );
}
