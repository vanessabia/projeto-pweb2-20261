import { configureStore } from "@reduxjs/toolkit";

import authReducer from "../feature/auth/authSlice";
import transactionsReducer from "../feature/auth/transactions/transactionsSlice";
import spendingLimitsReducer from "../feature/spendingLimits/spendingLimitsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    transactions: transactionsReducer,
    spendingLimits: spendingLimitsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;