import { users } from '@lib/api/users';
import { stripe } from '@lib/stripe';
import { User } from '@prisma/client';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import Stripe from 'stripe';
import { TProduct } from './../../lib/types/api.d';

type UserWithoutPass = Omit<User, 'password'>;

export interface UserState {
  wishlist: TProduct[];
  user: UserWithoutPass | null;
  userStripe: Stripe.Customer | null;
}

const initialState: UserState = {
  wishlist: [],
  user: null,
  userStripe: null,
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
    const user = response.data.data;
    return user;
  }
);

export const fetchUserByStripeId = createAsyncThunk(
  'user/fetchUserByStripeId',
  async (customerStripeId: string | null | undefined, thunkApi) => {
    if (customerStripeId) {
      const customer = await stripe.customers.retrieve(customerStripeId, {
        apiKey: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
      });
      return customer as Stripe.Customer;
    } else {
      return null;
    }
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
        if (action.payload) {
          state.user = action.payload;
        }
      })
      .addCase(fetchUserByStripeId.fulfilled, (state, action) => {
        if (action.payload) {
          state.userStripe = action.payload;
        }
      });
  },
});

export const { addProductsToWishlist, removeProductsFromWishlist } =
  userSlice.actions;

export default userSlice.reducer;
