import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../../services/api";
import type { TransactionRequest, TransactionResponse } from "./types";

export const fetchTransactions = createAsyncThunk<
  TransactionResponse[],
  void,
  { rejectValue: string }
>("transactions/fetchAll", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/transactions?size=100&sort=date,desc");
    return response.data.content;
  } catch {
    return rejectWithValue("Erro ao buscar transações");
  }
});

export const createTransaction = createAsyncThunk<
  TransactionResponse,
  TransactionRequest,
  { rejectValue: string }
>("transactions/create", async (data, { rejectWithValue }) => {
  try {
    const response = await api.post<TransactionResponse>("/transactions", data);
    return response.data;
  } catch {
    return rejectWithValue("Erro ao criar transação");
  }
});
