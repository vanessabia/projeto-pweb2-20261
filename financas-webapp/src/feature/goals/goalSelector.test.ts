import { describe, expect, it } from "vitest";
import { selectGoalsProgress } from "./goalSelectors";
import type { RootState } from "../../app/store";

describe("goalSelectors", () => {
  it("deve calcular corretamente o progresso da meta", () => {
    const state = {
        goals: {
            goals: [
                {
                    id: 1,
                    name: "Notebook",
                    targetAmount: 1000,
                    startDate: "2026-07-20",
                    deadline: "2026-12-31",
                    categoryId: 1,
                },
            ],
            loading: false,
            error: null,
        },

        transactions: {
            transactions: [
                {
                    id: 1,
                    amount: 400,
                    type: "INCOME",
                    categoryId: 1,
                    categoryName: "Salário",
                    date: "2026-07-21",
                },
            ],
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
    } as unknown as RootState;

    const result = selectGoalsProgress(state);

    expect(result[0].progress).toBe(40);
  });

  it("não deve considerar receitas de outra categoria", () => {
    const state = {
        goals: {
            goals: [
                {
                    id: 1,
                    name: "Notebook",
                    targetAmount: 1000,
                    startDate: "2026-07-20",
                    deadline: "2026-12-31",
                    categoryId: 1,
                },
            ],
            loading: false,
            error: null,
        },

        transactions: {
            transactions: [
                {
                    id: 1,
                    amount: 1000,
                    type: "INCOME",
                    categoryId: 2,
                    categoryName: "Outra",
                    date: "2026-07-21",
                },
            ],
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
    } as unknown as RootState;

    const result = selectGoalsProgress(state);

    expect(result[0].progress).toBe(0);
  });

  
});