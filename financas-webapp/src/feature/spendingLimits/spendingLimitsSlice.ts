import { createSlice } from "@reduxjs/toolkit";

import type { SpendingLimitsState } from "./types";

import {
  fetchSpendingLimits,
  fetchCategories,
  createSpendingLimit,
  deleteSpendingLimit,
} from "./spendingLimitsThunks";

const initialState: SpendingLimitsState = {
  spendingLimits: [],
  categories: [],
  loading: false,
  categoriesLoading: false,
  error: null,
};

const spendingLimitsSlice = createSlice({
  name: "spendingLimits",
  initialState,

  reducers: {
    clearSpendingLimitsError: (state) => {
      state.error = null;
    },
  },

  extraReducers: (builder) => {
    builder
      // Buscar limites
      .addCase(fetchSpendingLimits.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSpendingLimits.fulfilled, (state, action) => {
        state.loading = false;
        state.spendingLimits = action.payload;
      })
      .addCase(fetchSpendingLimits.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Erro ao buscar limites de gastos";
      })

      // Buscar categorias
      .addCase(fetchCategories.pending, (state) => {
        state.categoriesLoading = true;
        state.error = null;
      })
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categoriesLoading = false;
        state.categories = action.payload;
      })
      .addCase(fetchCategories.rejected, (state, action) => {
        state.categoriesLoading = false;
        state.error =
          action.payload ?? "Erro ao buscar categorias";
      })

      // Cadastrar limite
      .addCase(createSpendingLimit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createSpendingLimit.fulfilled, (state, action) => {
        state.loading = false;
        state.spendingLimits.push(action.payload);
      })
      .addCase(createSpendingLimit.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Erro ao cadastrar limite de gastos";
      })

      // Excluir limite
      .addCase(deleteSpendingLimit.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteSpendingLimit.fulfilled, (state, action) => {
        state.loading = false;

        state.spendingLimits = state.spendingLimits.filter(
          (limit) => limit.id !== action.payload
        );
      })
      .addCase(deleteSpendingLimit.rejected, (state, action) => {
        state.loading = false;
        state.error =
          action.payload ?? "Erro ao excluir limite de gastos";
      });
  },
});

export const { clearSpendingLimitsError } =
  spendingLimitsSlice.actions;

export default spendingLimitsSlice.reducer;