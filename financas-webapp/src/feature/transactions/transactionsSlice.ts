import { createSlice, createSelector } from "@reduxjs/toolkit";
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
        state.error =
          (action.payload as string) ?? "Erro ao buscar transações";
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
        state.error =
          (action.payload as string) ?? "Erro ao criar transação";
      });
  },
});

export default transactionsSlice.reducer;

// SELECTORS RF02

export const selectTransactions = (state: RootState) =>
  state.transactions.transactions;

export const selectTransactionsLoading = (state: RootState) =>
  state.transactions.loading;

export const selectTransactionsError = (state: RootState) =>
  state.transactions.error;

// SELECTORS RF03

// Transações do mês atual
export const selectCurrentMonthTransactions = createSelector(
  [selectTransactions],
  (transactions) => {
    const now = new Date();

    return transactions.filter((transaction) => {
      const date = new Date(transaction.date);

      return (
        date.getMonth() === now.getMonth() &&
        date.getFullYear() === now.getFullYear()
      );
    });
  }
);

// Total de receitas
export const selectIncome = createSelector(
  [selectCurrentMonthTransactions],
  (transactions) =>
    transactions
      .filter((t) => t.type === "INCOME")
      .reduce((total, t) => total + Number(t.amount), 0)
);

// Total de despesas
export const selectExpense = createSelector(
  [selectCurrentMonthTransactions],
  (transactions) =>
    transactions
      .filter((t) => t.type === "EXPENSE")
      .reduce((total, t) => total + Number(t.amount), 0)
);

// Saldo
export const selectBalance = createSelector(
  [selectIncome, selectExpense],
  (income, expense) => income - expense
);

// 5 transações mais recentes
export const selectRecentTransactions = createSelector(
  [selectTransactions],
  (transactions) =>
    [...transactions]
      .sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      .slice(0, 5)
);