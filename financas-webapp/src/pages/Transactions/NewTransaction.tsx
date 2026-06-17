import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../app/store";
import { createTransaction } from "../../feature/transactions/transactionsThunks";
import { selectTransactionsLoading, selectTransactionsError } from "../../feature/transactions/transactionsSlice";
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

  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState({
    amount: "",
    type: "INCOME",
    categoryId: "",
    date: "",
    description: "",
    tag: "",
  });

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    setForm({ ...form, [e.target.name]: e.target.value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.amount || !form.type || !form.categoryId || !form.date) {
      alert("Preencha todos os campos obrigatórios!");
      return;
    }

    await dispatch(
      createTransaction({
        amount: Number(form.amount),
        type: form.type as "INCOME" | "EXPENSE",
        categoryId: Number(form.categoryId),
        date: form.date,
        description: form.description || undefined,
        tag: form.tag || undefined,
      })
    );

    navigate("/transactions");
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

      <form onSubmit={handleSubmit} className="form">

        {/* VALOR */}
        <div className="form-group">
          <label>Valor *</label>
          <input
            type="number"
            name="amount"
            value={form.amount}
            onChange={handleChange}
            placeholder="0.00"
            min="0.01"
            step="0.01"
          />
        </div>

        {/* TIPO */}
        <div className="form-group">
          <label>Tipo *</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="INCOME">Receita</option>
            <option value="EXPENSE">Despesa</option>
          </select>
        </div>

        {/* CATEGORIA */}
        <div className="form-group">
          <label>Categoria *</label>
          <select
            name="categoryId"
            value={form.categoryId}
            onChange={handleChange}
          >
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        {/* DATA */}
        <div className="form-group">
          <label>Data *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        {/* DESCRIÇÃO */}
        <div className="form-group">
          <label>Descrição</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Ex: mercado, aluguel..."
          />
        </div>

        {/* TAG */}
        <div className="form-group">
          <label>Tag</label>
          <input
            type="text"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="Ex: fixo, variável..."
          />
        </div>

        {/* BOTÕES */}
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
            {loading ? "Salvando..." : "Salvar transação"}
          </button>

        </div>

      </form>

    </div>

  </div>
);
}