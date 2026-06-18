import { createSlice, createSelector } from "@reduxjs/toolkit";
import { fetchTransactions, createTransaction } from "./transactionsThunks";
import type {
  TransactionsState,
  TransactionResponse,
} from "./types";
import type { RootState } from "../../app/store";

type TransactionFilters = {
  description: string;
  category: string;
  type: string;
  startDate: string;
  endDate: string;
};

const initialState: TransactionsState = {
  transactions: [],
  loading: false,
  error: null,

  filters: {
    description: "",
    category: "",
    type: "",
    startDate: "",
    endDate: "",
  },
};

const transactionsSlice = createSlice({
  name: "transactions",
  initialState,
  reducers: {
  setDescriptionFilter: (state, action) => {
    state.filters.description = action.payload;
  },

  setCategoryFilter: (state, action) => {
    state.filters.category = action.payload;
  },

  setTypeFilter: (state, action) => {
    state.filters.type = action.payload;
  },

  setStartDateFilter: (state, action) => {
    state.filters.startDate = action.payload;
  },

  setEndDateFilter: (state, action) => {
    state.filters.endDate = action.payload;
  },
},
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

export const {
  setDescriptionFilter,
  setCategoryFilter,
  setTypeFilter,
  setStartDateFilter,
  setEndDateFilter,
} = transactionsSlice.actions;

export default transactionsSlice.reducer;

// SELECTORS RF02

export const selectTransactions = (state: RootState) =>
  state.transactions.transactions;

export const selectTransactionsLoading = (state: RootState) =>
  state.transactions.loading;

export const selectTransactionsError = (state: RootState) =>
  state.transactions.error;

export const selectFilters = (state: RootState) => {
  const transactionsState = state.transactions as TransactionsState & {
    filters: TransactionFilters;
  };

  return transactionsState.filters ?? {
    description: "",
    category: "",
    type: "",
    startDate: "",
    endDate: "",
  };
};
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

export const selectTotalTransactions = createSelector(
  [selectTransactions],
  (transactions) => transactions.length
);

export const selectFilteredTransactions = createSelector(
  [selectTransactions, selectFilters],
  (transactions, filters) => {
    return transactions.filter(
      (transaction: TransactionResponse) => {

        const descriptionMatch =
          !filters.description ||
          (transaction.description ?? "")
            .toLowerCase()
            .includes(filters.description.toLowerCase());

        const categoryMatch =
          !filters.category ||
          transaction.categoryName === filters.category;

        const typeMatch =
          !filters.type ||
          transaction.type === filters.type;

        const transactionDate = new Date(transaction.date);

        const startMatch =
          !filters.startDate ||
          transactionDate >= new Date(filters.startDate);

        const endMatch =
          !filters.endDate ||
          transactionDate <= new Date(filters.endDate);

        return (
          descriptionMatch &&
          categoryMatch &&
          typeMatch &&
          startMatch &&
          endMatch
        );
      }
    );
  }
);