import { createSlice } from "@reduxjs/toolkit";
import { login, register } from "./authThunks";
import type { AuthState } from "./types";

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.error = null;
      localStorage.removeItem("user");
      localStorage.removeItem("token");
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        localStorage.setItem(
          "user",
          JSON.stringify(action.payload)
        );

        if (action.payload && action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }

      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Erro ao fazer login";
      })

      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;

        localStorage.setItem(
          "user",
          JSON.stringify(action.payload)
        );

        if (action.payload && action.payload.token) {
          localStorage.setItem("token", action.payload.token);
        }

      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload ?? "Erro ao cadastrar";
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;