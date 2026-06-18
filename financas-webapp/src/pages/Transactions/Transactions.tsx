import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../app/store";
import { fetchTransactions } from "../../feature/transactions/transactionsThunks";
import {
  selectFilteredTransactions,
  selectTransactionsLoading,
} from "../../feature/transactions/transactionsSlice";

export default function Transactions() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const transactions = useSelector(selectFilteredTransactions);
  const loading = useSelector(selectTransactionsLoading);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [type, setType] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const categories = useMemo(() => {
  return [...new Set(transactions.map((t) => t.categoryName))];
}, [transactions]);

  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const filteredTransactions = transactions.filter((t) => {
  const matchesDescription =
    !search ||
    (t.description ?? "")
      .toLowerCase()
      .includes(search.toLowerCase());

  const matchesCategory =
    !category ||
    t.categoryName === category;

  const matchesType =
    !type ||
    t.type === type;

  const matchesPeriod =
    (!startDate || t.date >= startDate) &&
    (!endDate || t.date <= endDate);

  return (
    matchesDescription &&
    matchesCategory &&
    matchesType &&
    matchesPeriod
  );
});

  return (
    <div>
      <h1>Transações</h1>
      <button onClick={() => navigate("/transactions/new")}>Nova Transação</button>

      <div style={{ marginTop: "20px", marginBottom: "20px" }}>
  <input
    type="text"
    placeholder="Buscar descrição"
    value={search}
    onChange={(e) => setSearch(e.target.value)}
  />

  <select
    value={category}
    onChange={(e) => setCategory(e.target.value)}
  >
    <option value="">Todas as categorias</option>

    {categories.map((cat) => (
      <option key={cat} value={cat}>
        {cat}
      </option>
    ))}
  </select>

  <select
    value={type}
    onChange={(e) => setType(e.target.value)}
  >
    <option value="">Todos os tipos</option>
    <option value="INCOME">Receita</option>
    <option value="EXPENSE">Despesa</option>
  </select>

  <input
    type="date"
    value={startDate}
    onChange={(e) => setStartDate(e.target.value)}
  />

  <input
    type="date"
    value={endDate}
    onChange={(e) => setEndDate(e.target.value)}
  />
</div>

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
          {filteredTransactions.map((t) => (
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