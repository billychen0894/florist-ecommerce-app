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
  isSearchWindowOpen: boolean;
  setIsSearchWindowOpen: Dispatch<SetStateAction<boolean>>;
}

export const NavMenuContext = createContext<NavMenuContextType>({
  isMobileMenuOpen: false,
  setIsMobileMenuOpen: () => null,
  isSearchWindowOpen: false,
  setIsSearchWindowOpen: () => null,
} as NavMenuContextType);

export function NavMenuContextProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isSearchWindowOpen, setIsSearchWindowOpen] = useState<boolean>(false);

  const navMenuContext = useMemo(
    () => ({
      isMobileMenuOpen,
      setIsMobileMenuOpen,
      isSearchWindowOpen,
      setIsSearchWindowOpen,
    }),
    [isSearchWindowOpen, isMobileMenuOpen]
  );

  return (
    <NavMenuContext.Provider value={navMenuContext}>
      {children}
    </NavMenuContext.Provider>
  );
}
