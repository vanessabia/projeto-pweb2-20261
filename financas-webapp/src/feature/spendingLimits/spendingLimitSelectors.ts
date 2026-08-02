import type { RootState } from "../../app/store";

export const selectSpendingLimits = (state: RootState) =>
  state.spendingLimits.spendingLimits;

export const selectSpendingLimitsLoading = (state: RootState) =>
  state.spendingLimits.loading;

export const selectSpendingLimitsError = (state: RootState) =>
  state.spendingLimits.error;

export const selectCategories = (state: RootState) =>
  state.spendingLimits.categories;

export const selectCategoriesLoading = (state: RootState) =>
  state.spendingLimits.categoriesLoading;

export const selectSpendingLimitById = (
  state: RootState,
  limitId: number
) =>
  state.spendingLimits.spendingLimits.find(
    (limit) => limit.id === limitId
  );