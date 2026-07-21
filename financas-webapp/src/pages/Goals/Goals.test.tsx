import { describe, expect, it } from "vitest";
import { render, screen } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import Goals from "./Goals";

import goalsReducer from "../../feature/goals/goalsSlice";
import transactionsReducer from "../../feature/transactions/transactionsSlice";
import authReducer from "../../feature/auth/authSlice";

describe("Goals", () => {
  it("should render the goals page", () => {
    const store = configureStore({
      reducer: {
        auth: authReducer,
        transactions: transactionsReducer,
        goals: goalsReducer,
      },

      preloadedState: {
        auth: {
          user: null,
          loading: false,
          error: null,
        },

      transactions: {
        transactions: [],
        loading: false,
        error: null,
        filters: {
          description: "",
          category: "",
          type: "",
          startDate: "",
          endDate: "",
        },
      },

        goals: {
          loading: false,
          error: null,
          goals: [
            {
              id: 1,
              name: "Comprar Notebook",
              targetAmount: 5000,
              deadline: "2026-12-31",
              categoryId: 1,
            },
          ],
        },
      },
    });

    render(
      <Provider store={store}>
        <MemoryRouter>
          <Goals />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText("Comprar Notebook")
    ).toBeInTheDocument();

    expect(
      screen.getByText("R$ 5000.00")
    ).toBeInTheDocument();
  });
});