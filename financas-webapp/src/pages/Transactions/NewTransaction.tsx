import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import type { AppDispatch } from "../../app/store";
import { createTransaction } from "../../feature/transactions/transactionsThunks";
import { selectTransactionsLoading, selectTransactionsError } from "../../feature/transactions/transactionsSlice";
import { api } from "../../services/api";

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
    <div>
      <h1>Nova Transação</h1>
      {error && <p style={{ color: "red" }}>{error}</p>}

      <form onSubmit={handleSubmit}>
        <div>
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

        <div>
          <label>Tipo *</label>
          <select name="type" value={form.type} onChange={handleChange}>
            <option value="INCOME">Receita</option>
            <option value="EXPENSE">Despesa</option>
          </select>
        </div>

        <div>
          <label>Categoria *</label>
          <select name="categoryId" value={form.categoryId} onChange={handleChange}>
            <option value="">Selecione...</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        <div>
          <label>Data *</label>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
          />
        </div>

        <div>
          <label>Descrição</label>
          <input
            type="text"
            name="description"
            value={form.description}
            onChange={handleChange}
            placeholder="Descrição (opcional)"
          />
        </div>

        <div>
          <label>Tag</label>
          <input
            type="text"
            name="tag"
            value={form.tag}
            onChange={handleChange}
            placeholder="Tag (opcional)"
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Salvando..." : "Salvar"}
        </button>
        <button type="button" onClick={() => navigate("/transactions")}>
          Cancelar
        </button>
      </form>
    </div>
  );
}