import { TOrderItem } from '@lib/types/api';
import type {
  AnyAction,
  Dispatch,
  Middleware,
  MiddlewareAPI,
  PayloadAction,
} from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface CartState {
  cartItems: TOrderItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCart(state, action: PayloadAction<TOrderItem[]>) {
      state.cartItems = action.payload;
    },
    addItemToCart(state, action: PayloadAction<TOrderItem>) {
      state.cartItems.push(action.payload);
    },
  },
});

export const { initializeCart, addItemToCart } = cartSlice.actions;

export default cartSlice.reducer;

// Middleware to update localStorage whenever cart state changes
export const localStorageMiddleware: Middleware =
  (store: MiddlewareAPI) =>
  (next: Dispatch<AnyAction>) =>
  (action: AnyAction) => {
    // Call the next middleware or the reducer to process the action
    const result = next(action);
    // Update localStorage if the action is related to the cart
    if (
      action.type.startsWith('cart/') &&
      action.type !== 'cart/initializeCart'
    ) {
      const { cartItems } = store.getState().cartReducer;
      const cartItemsData = {
        cartItems: cartItems,
        createdAt: new Date().getTime(),
      };
      localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
    }
    // Return the result of processing the action
    return result;
  };
