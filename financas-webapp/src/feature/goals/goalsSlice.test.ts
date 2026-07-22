import { describe, expect, it } from "vitest";
import goalsReducer from "./goalsSlice";
import { fetchGoals, createGoal } from "./goalsThunks";

describe("goalsSlice", () => {
  it("should return the initial state", () => {
    const state = goalsReducer(undefined, {
      type: "@@INIT",
    });

    expect(state).toEqual({
      goals: [],
      loading: false,
      error: null,
    });
  });

  it("deve ativar loading ao buscar metas", () => {
  const state = goalsReducer(
    undefined,
    fetchGoals.pending("", undefined)
  );

  expect(state.loading).toBe(true);
  expect(state.error).toBeNull();
  });

  it("deve carregar as metas", () => {
  const goals = [
    {
      id: 1,
      name: "Notebook",
      targetAmount: 5000,
      startDate: "2026-07-22",
      deadline: "2026-12-31",
      categoryId: 1,
    },
  ];

  const state = goalsReducer(
    undefined,
    fetchGoals.fulfilled(goals, "", undefined)
  );

  expect(state.loading).toBe(false);
  expect(state.goals).toEqual(goals);
  });

  it("deve adicionar uma nova meta", () => {
  const goal = {
    id: 2,
    name: "Celular",
    targetAmount: 3000,
    startDate: "2026-07-22",
    deadline: "2026-11-30",
    categoryId: 2,
  };

  const state = goalsReducer(
    undefined,
    createGoal.fulfilled(goal, "", {
      name: goal.name,
      targetAmount: goal.targetAmount,
      startDate: goal.startDate,
      deadline: goal.deadline,
      categoryId: goal.categoryId,
    })
  );

  expect(state.goals).toContainEqual(goal);
  });

  
});

