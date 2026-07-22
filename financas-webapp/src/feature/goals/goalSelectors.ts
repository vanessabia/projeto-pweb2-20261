import { createSelector } from "@reduxjs/toolkit";
import type { RootState } from "../../app/store";

export const selectGoalProgress =
  (goalId: number) =>
  (state: RootState): number => {
    const goal = state.goals.goals.find((g) => g.id === goalId);

    if (!goal) return 0;

    const totalSaved = state.transactions.transactions
      .filter(
        (transaction) =>
          transaction.type === "INCOME" &&
          transaction.categoryId === goal.categoryId &&
          transaction.date >= goal.startDate &&
          transaction.date <= goal.deadline
      )
      .reduce(
        (total, transaction) => total + Number(transaction.amount),
        0
      );

    return Math.min((totalSaved / goal.targetAmount) * 100, 100);
  };

export const selectGoalsProgress = createSelector(
  [
    (state: RootState) => state.goals.goals,
    (state: RootState) => state.transactions.transactions,
  ],
  (goals, transactions) => {
    return goals.map((goal) => {
      const totalSaved = transactions
        .filter(
          (transaction) =>
            transaction.type === "INCOME" &&
            transaction.categoryId === goal.categoryId &&
            transaction.date >= goal.startDate &&
            transaction.date <= goal.deadline
        )
        .reduce(
          (total, transaction) => total + Number(transaction.amount),
          0
        );

      return {
        id: goal.id,
        progress: Math.min((totalSaved / goal.targetAmount) * 100, 100),
      };
    });
  }
);