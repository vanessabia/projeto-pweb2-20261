import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

import type { AppDispatch } from "../../app/store";
import { createGoal } from "../../feature/goals/goalsThunks";
import {
  selectGoalsLoading,
  selectGoalsError,
} from "../../feature/goals/goalsSlice";

import { api } from "../../services/api";

import "./NewGoal.css";

interface Category {
  id: number;
  name: string;
}

export default function NewGoal() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const loading = useSelector(selectGoalsLoading);
  const error = useSelector(selectGoalsError);

  const [categories, setCategories] = useState<Category[]>([]);

  const [form, setForm] = useState({
    name: "",
    targetAmount: "",
    deadline: "",
    categoryId: "",
  });

  useEffect(() => {
    api.get("/categories").then((res) => setCategories(res.data));
  }, []);

  function handleChange(
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    if (!form.name || !form.targetAmount || !form.deadline) {
      alert("Preencha os campos obrigatórios!");
      return;
    }

    await dispatch(
      createGoal({
        name: form.name,
        targetAmount: Number(form.targetAmount),
        deadline: form.deadline,
        categoryId: form.categoryId
          ? Number(form.categoryId)
          : undefined,
      })
    );

    navigate("/goals");
  }

  return (
    <div className="new-goal-container">

      <div className="new-goal-box">

        <h1>Nova Meta Financeira</h1>

        <p className="subtitle">
          Cadastre uma nova meta de economia
        </p>

        {error && <div className="error-box">{error}</div>}

        <form onSubmit={handleSubmit} className="form">

          <div className="form-group">
            <label>Nome *</label>

            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Valor-alvo *</label>

            <input
              type="number"
              name="targetAmount"
              value={form.targetAmount}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Data-limite *</label>

            <input
              type="date"
              name="deadline"
              value={form.deadline}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label>Categoria</label>

            <select
              name="categoryId"
              value={form.categoryId}
              onChange={handleChange}
            >
              <option value="">Nenhuma</option>

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

          <div className="button-group">

            <button
              type="button"
              className="cancel-button"
              onClick={() => navigate("/goals")}
            >
              Cancelar
            </button>

            <button
              type="submit"
              className="submit-button"
              disabled={loading}
            >
              {loading ? "Salvando..." : "Salvar Meta"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}