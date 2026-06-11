import { createSlice } from "@reduxjs/toolkit";
import { fetchTransactions, createTransaction } from "./transactionsThunks";
import type { TransactionsState } from "./types";
import type { RootState } from "../../app/store";

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTransactions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions = action.payload;
      })
      .addCase(fetchTransactions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? "Erro ao buscar transações";
      })
      .addCase(createTransaction.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createTransaction.fulfilled, (state, action) => {
        state.loading = false;
        state.transactions.unshift(action.payload);
      })
      .addCase(createTransaction.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string ?? "Erro ao criar transação";
      });
  },
});

export default transactionsSlice.reducer;

// Selectors RF02
export const selectTransactions = (state: RootState) => state.transactions.transactions;
export const selectTransactionsLoading = (state: RootState) => state.transactions.loading;
export const selectTransactionsError = (state: RootState) => state.transactions.error;

// Selectors RF03 (Dashboard)
export const selectBalance = (state: RootState) => {
  const { transactions } = state.transactions;
  const income = transactions.filter(t => t.type === "INCOME").reduce((acc, t) => acc + Number(t.amount), 0);
  const expense = transactions.filter(t => t.type === "EXPENSE").reduce((acc, t) => acc + Number(t.amount), 0);
  return income - expense;
};
export const selectIncome = (state: RootState) =>
  state.transactions.transactions.filter(t => t.type === "INCOME").reduce((acc, t) => acc + Number(t.amount), 0);
export const selectExpense = (state: RootState) =>
  state.transactions.transactions.filter(t => t.type === "EXPENSE").reduce((acc, t) => acc + Number(t.amount), 0);
export const selectRecentTransactions = (state: RootState) =>
  state.transactions.transactions.slice(0, 5);