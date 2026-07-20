import { createSlice } from "@reduxjs/toolkit";
import { fetchGoals, createGoal } from "./goalsThunks";
import type { GoalsState } from "./types";
import type { RootState } from "../../app/store";

const initialState: GoalsState = {
  goals: [],
  loading: false,
  error: null,
};

const goalsSlice = createSlice({
  name: "goals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchGoals.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchGoals.fulfilled, (state, action) => {
        state.loading = false;
        state.goals = action.payload;
      })
      .addCase(fetchGoals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Erro ao buscar metas";
      })
      .addCase(createGoal.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createGoal.fulfilled, (state, action) => {
        state.loading = false;
        state.goals.unshift(action.payload);
      })
      .addCase(createGoal.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Erro ao criar meta";
      });
  },
});

export default goalsSlice.reducer;

export const selectGoals = (state: RootState) => state.goals.goals;

export const selectGoalsLoading = (state: RootState) =>
  state.goals.loading;

export const selectGoalsError = (state: RootState) =>
  state.goals.error;