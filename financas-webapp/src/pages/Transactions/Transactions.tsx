import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../app/store";
import { fetchTransactions } from "../../feature/transactions/transactionsThunks";
import {
  selectTransactions,
  selectTransactionsLoading,
} from "../../feature/transactions/transactionsSlice";

export default function Transactions() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const transactions = useSelector(selectTransactions);
  const loading = useSelector(selectTransactionsLoading);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div>
      <h1>Transações</h1>
      <button onClick={() => navigate("/transactions/new")}>Nova Transação</button>

      {loading && <p>Carregando...</p>}

      <table>
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
              <td>{t.date}</td>
              <td>{t.description ?? "-"}</td>
              <td>{t.categoryName}</td>
              <td>{t.type === "INCOME" ? "Receita" : "Despesa"}</td>
              <td style={{ color: t.type === "INCOME" ? "green" : "red" }}>
                R$ {t.amount.toFixed(2)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}