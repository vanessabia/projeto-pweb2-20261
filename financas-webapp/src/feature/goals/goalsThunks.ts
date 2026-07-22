import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type { GoalRequest, GoalResponse } from "./types";

export const fetchGoals = createAsyncThunk<
  GoalResponse[],
  void,
  { rejectValue: string }
>("goals/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/goals");
    return response.data;
  } catch {
    return rejectWithValue("Erro ao buscar metas");
  }
});

export const createGoal = createAsyncThunk<
  GoalResponse,
  GoalRequest,
  { rejectValue: string }
>("goals/create", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post<GoalResponse>("/goals", data);
    return response.data;
  } catch {
    return rejectWithValue("Erro ao criar meta");
  }
});

export const updateGoal = createAsyncThunk(
  "goals/update",
  async (
    {
      id,
      data,
    }: {
      id: number;
      data: GoalRequest;
    },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.put(`/goals/${id}`, data);
      return response.data as GoalResponse;
    } catch {
      return rejectWithValue("Erro ao atualizar meta");
    }
  }
);

export const deleteGoal = createAsyncThunk(
  "goals/delete",
  async (id: number, { rejectWithValue }) => {
    try {
      await api.delete(`/goals/${id}`);
      return id;
    } catch {
      return rejectWithValue("Erro ao excluir meta");
    }
  }
);