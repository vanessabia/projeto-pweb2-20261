import { createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/api";
import type {
  LoginRequest,
  RegisterRequest,
  AuthResponse,
} from "./types";

export const login = createAsyncThunk<
  AuthResponse,
  LoginRequest,
  { rejectValue: string }
>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/login",
        credentials
      );

      return response.data;
    } catch {
      return rejectWithValue("Erro ao realizar login");
    }
  }
);

export const register = createAsyncThunk<
  AuthResponse,
  RegisterRequest,
  { rejectValue: string }
>(
  "auth/register",
  async (userData, { rejectWithValue }) => {
    try {
      const response = await api.post<AuthResponse>(
        "/auth/register",
        userData
      );

      return response.data;
    } catch {
      return rejectWithValue("Erro ao cadastrar usuário");
    }
  }
);