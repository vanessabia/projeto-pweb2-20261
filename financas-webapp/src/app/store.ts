import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../feature/auth/authSlice";
import transactionsReducer from "../feature/auth/transactions/transactionsSlice";
import goalsReducer from "../feature/goals/goalsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    goals: goalsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;