import { createSlice } from '@reduxjs/toolkit';
// import type { PayloadAction} from "@reduxjs/toolkit";

export interface TemplateState {
  // Add state properties here
}

const initialState: TemplateState = {
  // Add initial state properties here
};

const templateSlice = createSlice({
  name: 'template',
  initialState,
  reducers: {
    // Add reducers here
  },
});

export const {
  /* Add action creators here */
} = templateSlice.actions;

export default templateSlice.reducer;
