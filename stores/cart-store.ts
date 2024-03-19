import { TCartItem } from '@lib/types/types';
import { createStore } from 'zustand/vanilla';
import { persist } from 'zustand/middleware';

export type CartState = {
  cartItems: Record<string, TCartItem>;
  subtotal: number;
};

export type CartActions = {
  addItemToCart: (item: TCartItem) => void;
  removeItemFromCart: (itemId: string) => void;
  updateCartItemQuantity: (itemId: string, quantity: number) => void;
  resetCart: () => void;
};

export type CartStore = CartState & CartActions;

export const defaultInitState: CartState = {
  cartItems: {},
  subtotal: 0,
};

export const createCartStore = (initState: CartState = defaultInitState) => {
  return createStore<CartStore>()(
    persist(
      (set) => ({
        ...initState,
        addItemToCart: (item) =>
          set((state) => {
            const orderItem = item;
            state.cartItems[orderItem.id] = orderItem;
            state.subtotal += orderItem.quantity * orderItem.product.price;
            return state;
          }),
        removeItemFromCart: (itemId) =>
          set((state) => {
            if (state.cartItems.hasOwnProperty(itemId)) {
              const { quantity, product } = state.cartItems[itemId];
              if (state.subtotal - quantity * product.price < 0) {
                state.subtotal = 0;
              } else {
                state.subtotal -= quantity * product.price;
              }
              delete state.cartItems[itemId];
            }
            return state;
          }),
        updateCartItemQuantity: (itemId, quantity) =>
          set((state) => {
            if (state.cartItems[itemId]) {
              const prevSelectedQuantity = state.cartItems[itemId].quantity;
              const selectedProductPrice =
                state.cartItems[itemId].product.price;
              state.cartItems[itemId].quantity = quantity;
              state.subtotal +=
                quantity * selectedProductPrice -
                prevSelectedQuantity * selectedProductPrice;
            }
            return state;
          }),
        resetCart: () => set(initState),
      }),
      { name: 'cart' }
    )
  );
};
