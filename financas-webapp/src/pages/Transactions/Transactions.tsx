import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../app/store";
import { fetchTransactions } from "../../feature/transactions/transactionsThunks";
import {
  selectTransactions,
  selectTransactionsLoading,
} from "../../feature/transactions/transactionsSlice";
import "./Transactions.css";

export default function Transactions() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectTransactionsLoading);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div className="transactions-container">

      {/* HEADER */}
      <div className="transactions-header">

        <div>
          <h1>Transações</h1>
          <p>Histórico completo das suas movimentações</p>
        </div>

        <button
          className="back-button"
          onClick={() => navigate("/")}
        >
          ← Dashboard
        </button>
        
        <button
          className="new-transaction-btn"
          onClick={() => navigate("/transactions/new")}
        >
          + Nova Transação
        </button>

      </div>

      {/* LOADING */}
      {loading && <p className="loading">Carregando...</p>}

      {/* TABLE */}
      <div className="table-wrapper">

        <table className="transactions-table">

          <thead>
            <tr>
              <th>Data</th>
              <th>Descrição</th>
              <th>Categoria</th>
              <th>Tipo</th>
              <th>Valor</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((t) => (
              <tr key={t.id}>

                <td>
                  {new Date(t.date).toLocaleDateString("pt-BR")}
                </td>

                <td>
                  {t.description ?? "-"}
                </td>

                <td>
                  {t.categoryName}
                </td>

                <td>
                  <span
                    className={
                      t.type === "INCOME"
                        ? "type-income"
                        : "type-expense"
                    }
                  >
                    {t.type === "INCOME" ? "Receita" : "Despesa"}
                  </span>
                </td>

                <td
                  className={
                    t.type === "INCOME"
                      ? "value-income"
                      : "value-expense"
                  }
                >
                  {t.type === "INCOME" ? "+" : "-"}
                  R$ {t.amount.toFixed(2)}
                </td>

              </tr>
            ))}
          </tbody>

        </table>

      </div>

    </div>
  );
}