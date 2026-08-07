import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";

import type {
  CategoryResponse,
  SpendingLimitRequest,
  SpendingLimitResponse,
} from "./types";

export const fetchSpendingLimits = createAsyncThunk<
  SpendingLimitResponse[],
  void,
  { rejectValue: string }
>(
  "spendingLimits/fetchAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<SpendingLimitResponse[]>(
        "/spending-limits"
      );

      return response.data;
    } catch {
      return rejectWithValue("Erro ao buscar limites de gastos");
    }
  }
);

export const fetchCategories = createAsyncThunk<
  CategoryResponse[],
  void,
  { rejectValue: string }
>(
  "spendingLimits/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<CategoryResponse[]>("/categories");

      return response.data;
    } catch {
      return rejectWithValue("Erro ao buscar categorias");
    }
  }
);

export const createSpendingLimit = createAsyncThunk<
  SpendingLimitResponse,
  SpendingLimitRequest,
  { rejectValue: string }
>(
  "spendingLimits/create",
  async (data, { rejectWithValue }) => {
    try {
      const response = await api.post<SpendingLimitResponse>(
        "/spending-limits",
        data
      );

      return response.data;
    } catch {
      return rejectWithValue("Erro ao cadastrar limite de gastos");
    }
  }
);

export const deleteSpendingLimit = createAsyncThunk<
  number,
  number,
  { rejectValue: string }
>(
  "spendingLimits/delete",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/spending-limits/${id}`);

      return id;
    } catch {
      return rejectWithValue("Erro ao excluir limite de gastos");
    }
  }
);