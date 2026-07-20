import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type { GoalRequest, GoalResponse } from "./types";

// TODO: Ajustar conforme contrato da API

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