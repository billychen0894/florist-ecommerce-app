import { users } from '@lib/api/users';
import { User } from '@prisma/client';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import { TProduct } from './../../lib/types/api.d';

type UserWithoutPass = Omit<User, 'password'>;

export interface UserState {
  wishlist: TProduct[];
  user: UserWithoutPass | null;
}

const initialState: UserState = {
  wishlist: [],
  user: null,
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

export const fetchUserById = createAsyncThunk(
  'user/fetchUserById',
  async (
    data: {
      userId: string;
      axiosWithAuth: AxiosInstance;
    },
    thunkApi
  ) => {
    const { userId, axiosWithAuth } = data;
    const response = await users.getUser(userId, axiosWithAuth);
    const user = response.data;
    return user;
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    addProductsToWishlist(state, action: PayloadAction<TProduct>) {
      state.wishlist.push(action.payload);
    },
    removeProductsFromWishlist(state, action: PayloadAction<TProduct>) {
      state.wishlist = state.wishlist.filter(
        (product) => product.id !== action.payload.id
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserWishlistById.fulfilled, (state, action) => {
        state.wishlist = action.payload as TProduct[];
      })
      .addCase(fetchUserById.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { addProductsToWishlist, removeProductsFromWishlist } =
  userSlice.actions;

export default userSlice.reducer;
