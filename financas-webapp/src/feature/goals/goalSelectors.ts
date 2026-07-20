import type { RootState } from "../../app/store";

export const selectGoalProgress =
  (goalId: number) =>
  (state: RootState): number => {
    const goal = state.goals.goals.find((g) => g.id === goalId);

    if (!goal) return 0;

    const totalIncome = state.transactions.transactions
      .filter((transaction) => transaction.type === "INCOME")
      .reduce((total, transaction) => total + Number(transaction.amount), 0);

    const progress = (totalIncome / goal.targetAmount) * 100;

    return Math.min(progress, 100);
  };