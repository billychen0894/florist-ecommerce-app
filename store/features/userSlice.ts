import { orders } from '@lib/api/orders';
import { users } from '@lib/api/users';
import { stripe } from '@lib/stripe';
import { Order, TProduct } from '@lib/types/api.d';
import { User } from '@prisma/client';
import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';
import Stripe from 'stripe';

type UserWithoutPass = Omit<User, 'password'>;

export interface UserState {
  wishlist: TProduct[];
  user: UserWithoutPass | null;
  userStripe: Stripe.Customer | null;
  orders: Order[] | null;
  invoices: Stripe.ApiList<Stripe.Invoice> | null;
}

const initialState: UserState = {
  wishlist: [],
  user: null,
  userStripe: null,
  orders: null,
  invoices: null,
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

export const fetchUserInvoices = createAsyncThunk(
  'user/fetchUserInvoices',
  async (customerStripeId: string | null | undefined, thunkApi) => {
    if (customerStripeId) {
      const invoices = await stripe.invoices.list(
        {
          customer: customerStripeId,
        },
        {
          apiKey: process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY,
        }
      );
      return invoices;
    } else {
      return null;
    }
  }
);
export const fetchUserOrders = createAsyncThunk(
  'user/fetchUserOrders',
  async (
    data: {
      userId: string;
      axiosWithAuth: AxiosInstance;
    },
    thunkApi
  ) => {
    const { userId, axiosWithAuth } = data;
    const response = await orders.getUserOrders(userId, axiosWithAuth);
    const userOrders = response.data.data;
    return userOrders;
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
    updateUserInfo(
      state,
      action: PayloadAction<{
        firstName: string | null;
        lastName: string | null;
        phone: string | null;
        image: string | null;
      }>
    ) {
      const { firstName, lastName, phone, image } = action.payload;

      if (state.user) {
        state.user.name = `${firstName} ${lastName}`;
        state.user.phone = phone;
        state.user.image = image;
      }
    },
    updateUserStripeInfo(state, action: PayloadAction<{}>) {
      if (state.userStripe) {
        state.userStripe = {
          ...state.userStripe,
          ...action.payload,
        };
      }
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
      })
      .addCase(fetchUserOrders.fulfilled, (state, action) => {
        if (action.payload) {
          state.orders = action.payload;
        }
      })
      .addCase(fetchUserInvoices.fulfilled, (state, action) => {
        if (action.payload) {
          state.invoices = action.payload;
        }
      });
  },
});

export const {
  addProductsToWishlist,
  removeProductsFromWishlist,
  updateUserInfo,
  updateUserStripeInfo,
} = userSlice.actions;

export default userSlice.reducer;
