import { TCartItem } from '@lib/types/api';
import type {
  AnyAction,
  Dispatch,
  Middleware,
  MiddlewareAPI,
  PayloadAction,
} from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface CartState {
  cartItems: Record<string, TCartItem>;
}

const initialState: CartState = {
  cartItems: {},
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCart(state, action: PayloadAction<TCartItem[]>) {
      // Convert the array of items to a record for easier access
      state.cartItems = action.payload.reduce((acc, item) => {
        acc[item.id] = item;
        return acc;
      }, {} as Record<string, TCartItem>);
    },
    addItemToCart(state, action: PayloadAction<TCartItem>) {
      const orderItem = action.payload;
      // If the item is already in the cart, update its quantity
      if (state.cartItems[orderItem.id]) {
        state.cartItems[orderItem.id].quantity += orderItem.quantity;
      } else {
        state.cartItems[orderItem.id] = orderItem;
      }
    },
    updateCartItemQuantity(
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) {
      const { itemId, quantity } = action.payload;
      // Update the quantity of a specific item
      if (state.cartItems[itemId]) {
        state.cartItems[itemId].quantity = quantity;
      }
    },
  },
});

export const { initializeCart, addItemToCart, updateCartItemQuantity } =
  cartSlice.actions;

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
