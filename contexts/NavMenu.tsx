'use client';

import {
  createContext,
  Dispatch,
  SetStateAction,
  useMemo,
  useState,
} from 'react';

interface NavMenuContextType {
  isMobileMenuOpen: boolean;
  setIsMobileMenuOpen: Dispatch<SetStateAction<boolean>>;
}

export const NavMenuContext = createContext<NavMenuContextType>({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: () => null,
} as NavMenuContextType);

export function NavMenuContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);

  const navMenuContext = useMemo(
    () => ({
      isMobileMenuOpen,
      setIsMobileMenuOpen,
    }),
    [isMobileMenuOpen]
  );

  return (
    <NavMenuContext.Provider value={navMenuContext}>
      {children}
    </NavMenuContext.Provider>
  );
}
