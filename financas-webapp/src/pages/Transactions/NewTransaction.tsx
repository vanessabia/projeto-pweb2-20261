import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { AppDispatch } from "../../app/store";

import {
  createTransaction,
  fetchTransactions,
} from "../../feature/transactions/transactionsThunks";

import {
  selectTransactions,
  selectTransactionsError,
  selectTransactionsLoading,
} from "../../feature/transactions/transactionsSlice";

import {
  selectSpendingLimits,
} from "../../feature/spendingLimits/spendingLimitSelectors";

import {
  fetchSpendingLimits,
} from "../../feature/spendingLimits/spendingLimitsThunks";

import {
  notificationsAreSupported,
  requestNotificationPermission,
  showSpendingLimitNotification,
} from "../../services/spendingLimitNotifications";

import { api } from "../../services/api";

import "./NewTransaction.css";

interface Category {
  id: number;
  name: string;
}

export default function NewTransaction() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const loading = useSelector(selectTransactionsLoading);
  const error = useSelector(selectTransactionsError);
  const transactions = useSelector(selectTransactions);
  const spendingLimits = useSelector(selectSpendingLimits);

  const [categories, setCategories] = useState<Category[]>([]);

  const [notificationsEnabled, setNotificationsEnabled] =
    useState<boolean>(() => {
      return (
        notificationsAreSupported() &&
        Notification.permission === "granted"
      );
    });

  const [form, setForm] = useState({
    amount: "",
    type: "INCOME",
    categoryId: "",
    date: "",
    description: "",
    tag: "",
  });

  useEffect(() => {
    api
      .get<Category[]>("/categories")
      .then((response) => {
        setCategories(response.data);
      })
      .catch(() => {
        setCategories([]);
      });

    dispatch(fetchTransactions());
    dispatch(fetchSpendingLimits());
  }, [dispatch]);

  function handleChange(
    event: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [event.target.name]: event.target.value,
    });
  }

  async function handleEnableNotifications() {
    const permissionGranted =
      await requestNotificationPermission();

    setNotificationsEnabled(permissionGranted);

    if (permissionGranted) {
      alert("Notificações ativadas com sucesso.");
    } else {
      alert(
        "Não foi possível ativar as notificações. Verifique a permissão do navegador."
      );
    }
  }

  const spendingLimitAlert = useMemo(() => {
    if (
      form.type !== "EXPENSE" ||
      !form.categoryId ||
      !form.amount ||
      !form.date
    ) {
      return null;
    }

    const categoryId = Number(form.categoryId);
    const transactionAmount = Number(form.amount);
    const selectedDate = new Date(`${form.date}T00:00:00`);

    const spendingLimit = spendingLimits.find(
      (limit) => limit.categoryId === categoryId
    );

    if (!spendingLimit || transactionAmount <= 0) {
      return null;
    }

    const currentSpentAmount = transactions
      .filter((transaction) => {
        const transactionDate = new Date(transaction.date);

        const sameCategory =
          transaction.categoryId === categoryId;

        const isExpense =
          transaction.type === "EXPENSE";

        const sameMonth =
          transactionDate.getMonth() ===
            selectedDate.getMonth() &&
          transactionDate.getFullYear() ===
            selectedDate.getFullYear();

        return sameCategory && isExpense && sameMonth;
      })
      .reduce(
        (total, transaction) =>
          total + Number(transaction.amount),
        0
      );

    const limitAmount = Number(spendingLimit.limitAmount);

    const projectedAmount =
      currentSpentAmount + transactionAmount;

    const projectedPercentage =
      limitAmount > 0
        ? (projectedAmount / limitAmount) * 100
        : 0;

    if (projectedPercentage < 80) {
      return null;
    }

    return {
      categoryName: spendingLimit.categoryName,
      limitAmount,
      projectedAmount,
      projectedPercentage,
      exceeded: projectedPercentage >= 100,
    };
  }, [
    form.amount,
    form.categoryId,
    form.date,
    form.type,
    spendingLimits,
    transactions,
  ]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (
      !form.amount ||
      !form.type ||
      !form.categoryId ||
      !form.date
    ) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    const result = await dispatch(
      createTransaction({
        amount: Number(form.amount),
        type: form.type as "INCOME" | "EXPENSE",
        categoryId: Number(form.categoryId),
        date: form.date,
        description: form.description || undefined,
        tag: form.tag || undefined,
      })
    );

    if (createTransaction.fulfilled.match(result)) {
      if (spendingLimitAlert && notificationsEnabled) {
        await showSpendingLimitNotification({
          title: spendingLimitAlert.exceeded
            ? "Limite de gastos ultrapassado"
            : "Limite de gastos próximo",
          body: `${
            spendingLimitAlert.categoryName
          }: ${Math.round(
            spendingLimitAlert.projectedPercentage
          )}% do limite mensal utilizado.`,
        });
      }

      navigate("/transactions");
    }
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return (
    <div className="new-transaction-container">
      <div className="new-transaction-box">
        <h1>Nova Transação</h1>

        <p className="subtitle">
          Registre uma receita ou despesa
        </p>

        {error && (
          <div className="error-box">
            {error}
          </div>
        )}

        {notificationsAreSupported() && (
          <div className="notification-permission-box">
            <span>
              Notificações:{" "}
              <strong>
                {notificationsEnabled
                  ? "ativadas"
                  : "desativadas"}
              </strong>
            </span>

            {!notificationsEnabled && (
              <button
                type="button"
                className="notification-button"
                onClick={handleEnableNotifications}
              >
                Ativar notificações
              </button>
            )}
          </div>
        )}

        <form onSubmit={handleSubmit} className="form">
          <div className="form-group">
            <label htmlFor="amount">Valor *</label>

            <input
              id="amount"
              type="number"
              name="amount"
              value={form.amount}
              onChange={handleChange}
              placeholder="0.00"
              min="0.01"
              step="0.01"
            />
          </div>

          <div className="form-group">
            <label htmlFor="type">Tipo *</label>

            <select
              id="type"
              name="type"
              value={form.type}
              onChange={handleChange}
            >
              <option value="INCOME">Receita</option>
              <option value="EXPENSE">Despesa</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="categoryId">
              Categoria *
            </label>

            <select
              id="categoryId"
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">Selecione...</option>

              {categories.map((category) => (
                <option
                  key={category.id}
                  value={category.id}
                >
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="date">Data *</label>

            <input
              id="date"
              type="date"
              name="date"
              value={form.date}
              onChange={handleChange}
            />
          </div>

          {spendingLimitAlert && (
            <div
              className={
                spendingLimitAlert.exceeded
                  ? "spending-limit-alert danger"
                  : "spending-limit-alert warning"
              }
              role="alert"
            >
              <strong>
                {spendingLimitAlert.exceeded
                  ? "Limite ultrapassado!"
                  : "Atenção: limite próximo!"}
              </strong>

              <p>
                A categoria{" "}
                <strong>
                  {spendingLimitAlert.categoryName}
                </strong>{" "}
                ficará em{" "}
                <strong>
                  {Math.round(
                    spendingLimitAlert.projectedPercentage
                  )}
                  %
                </strong>{" "}
                do limite mensal.
              </p>

              <p>
                Gasto após esta transação:{" "}
                <strong>
                  {formatCurrency(
                    spendingLimitAlert.projectedAmount
                  )}
                </strong>{" "}
                de{" "}
                <strong>
                  {formatCurrency(
                    spendingLimitAlert.limitAmount
                  )}
                </strong>
                .
              </p>
            </div>
          )}

          <div className="form-group">
            <label htmlFor="description">
              Descrição
            </label>

            <input
              id="description"
              type="text"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Ex.: mercado, aluguel..."
            />
          </div>

          <div className="form-group">
            <label htmlFor="tag">Tag</label>

            <input
              id="tag"
              type="text"
              name="tag"
              value={form.tag}
              onChange={handleChange}
              placeholder="Ex.: fixo, variável..."
            />
          </div>

          <div className="button-group">
            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/transactions")}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading
                ? "Salvando..."
                : "Salvar transação"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}