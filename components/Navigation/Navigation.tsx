'use client';

import { useState } from 'react';

import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';

export default function Navigation() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <MobileMenu isOpen={open} onOpen={setOpen} />
      <DesktopMenu onOpen={setOpen} />
    </>
  );
}
