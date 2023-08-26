import { OrderItem } from '@lib/types/api';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';

export interface CartState {
  cartItems: OrderItem[];
}

const initialState: CartState = {
  cartItems: [],
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addItemToCart(state, action: PayloadAction<OrderItem>) {
      state.cartItems.push(action.payload);
    },
  },
});

export const { addItemToCart } = cartSlice.actions;

export default cartSlice.reducer;
