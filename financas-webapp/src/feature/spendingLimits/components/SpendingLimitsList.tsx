import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";

import type { AppDispatch } from "../../../app/store";

import {
  selectSpendingLimits,
  selectSpendingLimitsError,
  selectSpendingLimitsLoading,
} from "../spendingLimitSelectors";

import {
  deleteSpendingLimit,
  fetchSpendingLimits,
} from "../spendingLimitsThunks";

import { selectTransactions } from "../../auth/transactions/transactionsSlice";
import { fetchTransactions } from "../../auth/transactions/transactionsThunks";

import SpendingLimitProgress from "./SpendingLimitProgress";

function SpendingLimitsList() {
  const dispatch = useDispatch<AppDispatch>();

  const spendingLimits = useSelector(selectSpendingLimits);
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectSpendingLimitsLoading);
  const error = useSelector(selectSpendingLimitsError);

  useEffect(() => {
    dispatch(fetchSpendingLimits());
    dispatch(fetchTransactions());
  }, [dispatch]);

  async function handleDelete(
    id: number,
    categoryName: string
  ) {
    const confirmed = window.confirm(
      `Deseja excluir o limite da categoria ${categoryName}?`
    );

    if (!confirmed) {
      return;
    }

    await dispatch(deleteSpendingLimit(id));
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  function calculateSpentAmount(categoryId: number) {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();

    return transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);

        const isCurrentMonth =
          transactionDate.getMonth() === currentMonth &&
          transactionDate.getFullYear() === currentYear;

        return (
          transaction.type === "EXPENSE" &&
          transaction.categoryId === categoryId &&
          isCurrentMonth
        );
      })
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );
  }

  if (loading && spendingLimits.length === 0) {
    return (
      <p className="spending-limits-message">
        Carregando limites...
      </p>
    );
  }

  if (error && spendingLimits.length === 0) {
    return (
      <p
        className="spending-limits-error"
        role="alert"
      >
        {error}
      </p>
    );
  }

  if (spendingLimits.length === 0) {
    return (
      <p className="spending-limits-message">
        Nenhum limite de gastos cadastrado.
      </p>
    );
  }

  return (
    <div className="spending-limits-list">
      {spendingLimits.map((limit) => {
        const limitAmount = Number(limit.limitAmount);
        const spentAmount = calculateSpentAmount(
          limit.categoryId
        );

        return (
          <article
            key={limit.id}
            className="spending-limit-card"
          >
            <h3>{limit.categoryName}</h3>

            <p>
              Limite mensal:{" "}
              <strong>
                {formatCurrency(limitAmount)}
              </strong>
            </p>

            <SpendingLimitProgress
              limitAmount={limitAmount}
              spentAmount={spentAmount}
            />

            <button
              type="button"
              className="spending-limit-delete"
              onClick={() =>
                handleDelete(
                  limit.id,
                  limit.categoryName
                )
              }
              disabled={loading}
            >
              Excluir
            </button>
          </article>
        );
      })}
    </div>
  );
}

export default SpendingLimitsList;