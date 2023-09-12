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
  subtotal: number;
}

const initialState: CartState = {
  cartItems: {},
  subtotal: 0,
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    initializeCart(state, action: PayloadAction<Record<string, TCartItem>>) {
      state.cartItems = action.payload;
      const cartItemsArr = Object.values(state.cartItems);
      const subtotal = cartItemsArr.reduce((acc, item) => {
        return acc + item.quantity * item.product.price;
      }, 0);
      state.subtotal = subtotal;
    },
    addItemToCart(state, action: PayloadAction<TCartItem>) {
      const orderItem = action.payload;
      // If the item is already in the cart, update its quantity
      if (state.cartItems[orderItem.id]) {
        state.cartItems[orderItem.id].quantity += orderItem.quantity;
        state.subtotal += orderItem.quantity * orderItem.product.price;
      } else {
        state.cartItems[orderItem.id] = orderItem;
        state.subtotal += orderItem.quantity * orderItem.product.price;
      }
    },
    removeItemFromCart(state, action: PayloadAction<{ itemId: string }>) {
      if (state.cartItems.hasOwnProperty(action.payload.itemId)) {
        const { quantity, product } = state.cartItems[action.payload.itemId];
        if (state.subtotal - quantity * product.price < 0) {
          state.subtotal = 0;
        } else {
          state.subtotal -= quantity * product.price;
        }
        delete state.cartItems[action.payload.itemId];
      }
    },
    updateCartItemQuantity(
      state,
      action: PayloadAction<{ itemId: string; quantity: number }>
    ) {
      const { itemId, quantity } = action.payload;
      // Update the quantity of a specific item
      if (state.cartItems[itemId]) {
        const prevSelectedQuantity = state.cartItems[itemId].quantity;
        const selectedProductPrice = state.cartItems[itemId].product.price;
        state.cartItems[itemId].quantity = quantity;
        state.subtotal +=
          quantity * selectedProductPrice -
          prevSelectedQuantity * selectedProductPrice;
      }
    },
    resetCart(state) {
      state.cartItems = {};
      state.subtotal = 0;
    },
  },
});

export const {
  initializeCart,
  addItemToCart,
  updateCartItemQuantity,
  removeItemFromCart,
  resetCart,
} = cartSlice.actions;

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
      const { cartItems }: { cartItems: Record<string, TCartItem> } =
        store.getState().cartReducer;

      if (
        Object.keys(cartItems).length === 0 ||
        action.type === 'cart/resetCart'
      ) {
        localStorage.removeItem('cartItems');
      } else {
        const cartItemsData = {
          cartItems: cartItems,
          createdAt: new Date().getTime(),
        };
        localStorage.setItem('cartItems', JSON.stringify(cartItemsData));
      }
    }
    // Return the result of processing the action
    return result;
  };
