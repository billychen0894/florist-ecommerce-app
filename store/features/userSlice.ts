import { users } from '@lib/api/users';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { ProductFullInfo } from './../../lib/types/api.d';

export interface UserState {
  wishlist: ProductFullInfo[];
}

const initialState: UserState = {
  wishlist: [],
};

export const fetchUserWishlistById = createAsyncThunk(
  'user/fetchUserWishlist',
  async (
    data: {
      userId: string;
      axiosWithAuth: AxiosInstance;
    },
    thunkApi
  ) => {
    const { userId, axiosWithAuth } = data;
    const response = await users.getUserWishlist(userId, axiosWithAuth);
    const wishlist = response.data.data?.wishlist;
    return wishlist;
  }
);

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
  extraReducers: (builder) => {
    builder.addCase(fetchUserWishlistById.fulfilled, (state, action) => {
      state.wishlist = action.payload as ProductFullInfo[];
    });
  },
});

export const { addProductsToWishlist, removeProductsFromWishlist } =
  userSlice.actions;

export default userSlice.reducer;
