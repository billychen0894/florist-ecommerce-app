import { TCartItem } from '@lib/types/types';
import { createStore } from 'zustand/vanilla';
import { devtools, persist } from 'zustand/middleware';

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
    devtools(
      persist(
        (set) => ({
          ...initState,
          addItemToCart: (item) =>
            set((state) => ({
              cartItems: {
                ...state.cartItems,
                [item.id]: {
                  ...item,
                  quantity: state.cartItems[item.id]
                    ? state.cartItems[item.id].quantity + item.quantity
                    : item.quantity,
                },
              },
              subtotal: state.subtotal + item.quantity * item.product.price,
            })),
          removeItemFromCart: (itemId) =>
            set((state) => {
              const newCartItems = { ...state.cartItems };
              delete newCartItems[itemId];

              return {
                cartItems: newCartItems,
                subtotal:
                  state.subtotal -
                  state.cartItems[itemId].quantity *
                    state.cartItems[itemId].product.price,
              };
            }),
          updateCartItemQuantity: (itemId, quantity) =>
            set((state) => ({
              cartItems: {
                ...state.cartItems,
                [itemId]: {
                  ...state.cartItems[itemId],
                  quantity,
                },
              },
              subtotal:
                state.subtotal +
                (quantity * state.cartItems[itemId].product.price -
                  state.cartItems[itemId].quantity *
                    state.cartItems[itemId].product.price),
            })),
          resetCart: () => set(initState),
        }),
        { name: 'cart' }
      )
    )
  );
};
