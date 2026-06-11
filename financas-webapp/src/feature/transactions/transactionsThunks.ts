import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type { TransactionRequest, TransactionResponse } from "./types";

export const fetchTransactions = createAsyncThunk(
  "transactions/fetchAll",
  async (_: void, { rejectWithValue }) => {
    try {
      const response = await api.get("/transactions?size=100&sort=date,desc");
      return response.data.content as TransactionResponse[];
    } catch {
      return rejectWithValue("Erro ao buscar transações");
    }
  }
);

export const createTransaction = createAsyncThunk(
  "transactions/create",
  async (data: TransactionRequest, { rejectWithValue }) => {
    try {
      const response = await api.post("/transactions", data);
      return response.data as TransactionResponse;
    } catch {
      return rejectWithValue("Erro ao criar transação");
    }
  }
);