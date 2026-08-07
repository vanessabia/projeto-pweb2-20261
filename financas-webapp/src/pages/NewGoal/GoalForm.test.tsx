import { describe, expect, it } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Provider } from "react-redux";
import { configureStore } from "@reduxjs/toolkit";
import { MemoryRouter } from "react-router-dom";

import NewGoal from "./NewGoal";

import goalsReducer from "../../feature/goals/goalsSlice";
import transactionsReducer from "../../feature/transactions/transactionsSlice";
import authReducer from "../../feature/auth/authSlice";

describe("NewGoal", () => {
  const store = configureStore({
    reducer: {
      auth: authReducer,
      transactions: transactionsReducer,
      goals: goalsReducer,
    },
  });

  it("should render the new goal form", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewGoal />
        </MemoryRouter>
      </Provider>
    );

    expect(
      screen.getByText(/Nova Meta Financeira/i)
    ).toBeInTheDocument();

    expect(
      screen.getByText(/Cadastre uma nova meta de economia/i)
    ).toBeInTheDocument();

    expect(
      screen.getByRole("button", {
        name: /Cancelar/i,
      })
    ).toBeInTheDocument();

    expect(
      screen.getByRole("textbox")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("spinbutton")
    ).toBeInTheDocument();

    expect(
      screen.getByRole("combobox")
    ).toBeInTheDocument();
  });

  it("should allow filling the required fields", () => {
    render(
      <Provider store={store}>
        <MemoryRouter>
          <NewGoal />
        </MemoryRouter>
      </Provider>
    );

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Notebook" },
    });

    fireEvent.change(screen.getByRole("spinbutton"), {
      target: { value: "5000" },
    });

    const dateInputs = document.querySelectorAll(
      'input[type="date"]'
    );

    fireEvent.change(dateInputs[0], {
      target: { value: "2026-07-22" },
    });

    fireEvent.change(dateInputs[1], {
      target: { value: "2026-12-31" },
    });

    expect(
      screen.getByDisplayValue("Notebook")
    ).toBeInTheDocument();

    expect(
      screen.getByDisplayValue("5000")
    ).toBeInTheDocument();

    expect(
      (dateInputs[0] as HTMLInputElement).value
    ).toBe("2026-07-22");

    expect(
      (dateInputs[1] as HTMLInputElement).value
    ).toBe("2026-12-31");
  });
});