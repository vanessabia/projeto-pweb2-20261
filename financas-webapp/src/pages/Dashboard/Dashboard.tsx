import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";

import "./Dashboard.css";

import type { AppDispatch, RootState } from "../../app/store";
import { fetchTransactions } from "../../feature/transactions/transactionsThunks";

import {
  selectBalance,
  selectIncome,
  selectExpense,
  selectRecentTransactions,
  selectTotalTransactions,
} from "../../feature/transactions/transactionsSlice";

function Dashboard() {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();

  const balance = useSelector(selectBalance);
  const income = useSelector(selectIncome);
  const expense = useSelector(selectExpense);
  const recentTransactions = useSelector(selectRecentTransactions);
  const totalTransactions = useSelector(selectTotalTransactions);

  const user = useSelector((state: RootState) => state.auth.user);
  const userName = user?.name || user?.username || "Usuário";

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  function handleLogout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    navigate("/login");
  }

  function formatCurrency(value: number) {
    return value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  }

  return (
    <div className="dashboard-container">
      {/* HEADER */}
      <header className="dashboard-header">
        <div>
          <h1>Dashboard Financeiro</h1>

          <p>
            Bem-vindo ao seu dashboard,{" "}
            <strong className="username">{userName}</strong>
          </p>
        </div>

        <div className="dashboard-actions">
          <Link
            to="/spending-limits"
            className="spending-limits-button"
          >
            Limites de gastos
          </Link>

          <button
            type="button"
            className="logout-button"
            onClick={handleLogout}
          >
            Sair
          </button>
        </div>
      </header>

      {/* ACESSOS PRINCIPAIS */}
      <section className="top-section">
        <div className="balance-card">
          <span className="card-label">Saldo Atual</span>

          <h2>{formatCurrency(balance)}</h2>

          <small>Disponível</small>
        </div>

        <Link
          to="/transactions/new"
          className="new-transaction-card"
        >
          <div className="plus-icon">+</div>

          <h3>Nova Transação</h3>

          <p>
            Registrar receita
            <br />
            ou despesa
          </p>
        </Link>

        <Link to="/goals" className="new-goal-card">
          <div className="plus-icon">+</div>

          <h3>Nova Meta Financeira</h3>

          <p>
            Gerenciar
            <br />
            metas de economia
          </p>
        </Link>
      </section>

      {/* RESUMO */}
      <section className="summary">
        <div className="card income">
          <span>Receitas</span>
          <h2>{formatCurrency(income)}</h2>
        </div>

        <div className="card expense">
          <span>Despesas</span>
          <h2>{formatCurrency(expense)}</h2>
        </div>

        <div className="card total">
          <span>Total Transações</span>
          <h2>{totalTransactions}</h2>
        </div>
      </section>

      {/* TRANSAÇÕES */}
      <section className="transactions-card">
        <div className="transactions-header">
          <h2>Últimas Transações</h2>
        </div>

        {recentTransactions.length === 0 ? (
          <p className="empty-state">
            Nenhuma transação encontrada.
          </p>
        ) : (
          <>
            <ul className="transaction-list">
              {recentTransactions.map((transaction) => (
                <li
                  key={transaction.id}
                  className="transaction-item"
                >
                  <div>
                    <strong>
                      {transaction.description || "Sem descrição"}
                    </strong>

                    <span>
                      {transaction.type === "INCOME"
                        ? "Receita"
                        : "Despesa"}{" "}
                      •{" "}
                      {new Date(
                        transaction.date
                      ).toLocaleDateString("pt-BR")}
                    </span>
                  </div>

                  <strong
                    className={
                      transaction.type === "INCOME"
                        ? "income-text"
                        : "expense-text"
                    }
                  >
                    {transaction.type === "INCOME" ? "+" : "-"}
                    {formatCurrency(transaction.amount)}
                  </strong>
                </li>
              ))}
            </ul>

            <div className="transactions-footer">
              <Link
                to="/transactions"
                className="view-all-button"
              >
                Ver todas as transações
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}

export default Dashboard;