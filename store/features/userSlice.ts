import type { PayloadAction } from '@reduxjs/toolkit';
import { createSlice } from '@reduxjs/toolkit';
import { ProductFullInfo } from './../../lib/types/api.d';

export interface UserState {
  wishlist: ProductFullInfo[];
}

const initialState: UserState = {
  wishlist: [],
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addProductsToWishlist(state, action: PayloadAction<ProductFullInfo>) {
      state.wishlist.push(action.payload);
    },
    removeProductsFromWishlist(state, action: PayloadAction<ProductFullInfo>) {
      state.wishlist = state.wishlist.filter(
        (product) => product.id !== action.payload.id
      );
    },
  },
});

export const { addProductsToWishlist, removeProductsFromWishlist } =
  userSlice.actions;

export default userSlice.reducer;
