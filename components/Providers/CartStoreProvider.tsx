'use client';

import { createCartStore, type CartStore } from '@/stores/cart-store';
import { createContext, useContext, useRef } from 'react';
import { useStore, type StoreApi } from 'zustand';

export const CartStoreContext = createContext<StoreApi<CartStore> | null>(null);

export const CartStoreProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const storeRef = useRef<StoreApi<CartStore> | null>(null);

  if (!storeRef.current) {
    storeRef.current = createCartStore();
  }

  return (
    <CartStoreContext.Provider value={storeRef.current}>
      {children}
    </CartStoreContext.Provider>
  );
};

export const useCartStore = <T,>(selector: (store: CartStore) => T) => {
  const cartStoreContext = useContext(CartStoreContext);

  if (!cartStoreContext) {
    throw new Error('useCartStore must be used within a CartStoreProvider');
  }

  return useStore(cartStoreContext, selector);
};
