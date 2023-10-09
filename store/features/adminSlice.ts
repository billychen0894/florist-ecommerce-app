import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import { User } from '@lib/types/api';
import { Order } from '@prisma/client';
import { AxiosInstance } from 'axios';
import { admin } from '@lib/api/admin';

// import type { PayloadAction} from "@reduxjs/toolkit";

export interface AdminState {
  accountUsers: User[];
  orders: Order[];
}

const initialState: AdminState = {
  accountUsers: [],
  orders: [],
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
const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {
    // Add reducers here
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountUsers.fulfilled, (state, action) => {
        state.accountUsers = action.payload;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.orders = action.payload;
      });
  },
});

export const {
  /* Add action creators here */
} = adminSlice.actions;

export default adminSlice.reducer;
