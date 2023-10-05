'use client';

import { useEffect, useState } from 'react';

import DesktopMenu from './DesktopMenu';
import MobileMenu from './MobileMenu';
import { usePathname } from 'next/navigation';

export function Navigation() {
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const pathname = usePathname();
  // Check if its mobile or desktop size
  useEffect(() => {
    const mediaQuery = window.matchMedia('(min-width: 640px)');
    const handleMediaQueryChange = (mediaQuery: MediaQueryListEvent) => {
      if (mediaQuery.matches) {
        setIsMobile(false);
      } else {
        setIsMobile(true);
      }
    };

    mediaQuery.addEventListener('change', handleMediaQueryChange);
    return () => {
      mediaQuery.removeEventListener('change', handleMediaQueryChange);
    };
  }, []);

  if (pathname.startsWith('/admin')) return null;

  return (
    <>
      <MobileMenu isOpen={open} onOpen={setOpen} isMobile={isMobile} />
      <DesktopMenu onOpen={setOpen} isOpen={open} isMobile={isMobile} />
    </>
  );
}
