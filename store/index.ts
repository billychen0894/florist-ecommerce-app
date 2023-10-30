import { Action, configureStore, ThunkAction } from '@reduxjs/toolkit';
import cartReducer, { localStorageMiddleware } from './features/cartSlice';
import userReducer from './features/userSlice';
import adminReducer from './features/adminSlice';

export function makeStore() {
  return configureStore({
    reducer: {
      cartReducer,
      userReducer,
      adminReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(localStorageMiddleware),
  });
}

const store = makeStore();

export type AppState = ReturnType<typeof store.getState>;

export type AppDispatch = typeof store.dispatch;

export type AppThunk<ReturnType = void> = ThunkAction<
  ReturnType,
  AppState,
  unknown,
  Action<string>
>;

export default store;
