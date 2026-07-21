import { describe, expect, it, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import NewGoal from "./NewGoal";
import goalsReducer from "../../feature/goals/goalsSlice";
import transactionsReducer from "../../feature/transactions/transactionsSlice";
import authReducer from "../../feature/auth/authSlice";

describe("NewGoal", () => {
  it("should not submit with required fields empty", () => {
    window.alert = vi.fn();

    const store = configureStore({
      reducer: {
        auth: authReducer,
        transactions: transactionsReducer,
        goals: goalsReducer,
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewGoal />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.click(
      screen.getByRole("button", {
        name: /salvar meta/i,
      })
    );

    expect(window.alert).toHaveBeenCalled();
  });
});