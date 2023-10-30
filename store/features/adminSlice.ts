import type { PayloadAction } from '@reduxjs/toolkit';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '@lib/types/api';
import { Category, Order } from '@prisma/client';
import { AxiosInstance } from 'axios';
import { admin } from '@lib/api/admin';
import { OrderStatus } from '@node_modules/@prisma/client';
import { categories } from '@lib/api/categories';

export interface AdminState {
  accountUsers: User[];
  orders: Order[];
  categories: Category[];
}

const initialState: AdminState = {
  accountUsers: [],
  orders: [],
  categories: [],
};

export const fetchAccountUsers = createAsyncThunk(
  'admin/fetchAccountUsers',
  async (axiosWithAuth: AxiosInstance, thunkAPI) => {
    const response = await admin.getAllUsers(axiosWithAuth);
    return response.data.data as User[];
  }
);

export const fetchOrders = createAsyncThunk(
  'admin/fetchOrders',
  async (axiosWithAuth: AxiosInstance, thunkAPI) => {
    const response = await admin.getOrders(axiosWithAuth);
    return response.data.data as Order[];
  }
);

export const fetchCategories = createAsyncThunk(
  'admin/fetchCategories',
  async (_, thunkAPI) => {
    const response = await categories.getAllCategories();
    return response.data.data as Category[];
  }
);

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    updateOrder(
      state,
      action: PayloadAction<{
        stripeInvoiceId: string;
        orderStatus: OrderStatus;
      }>
    ) {
      if (action.payload.stripeInvoiceId) {
        const orderIdx = state.orders.findIndex(
          (order) => order.stripeInvoiceId === action.payload.stripeInvoiceId
        );
        state.orders[orderIdx] = {
          ...state.orders[orderIdx],
          ...action.payload,
        };
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountUsers.fulfilled, (state, action) => {
        state.accountUsers = action.payload;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      });
  },
});

export const { updateOrder } = adminSlice.actions;

export default adminSlice.reducer;
