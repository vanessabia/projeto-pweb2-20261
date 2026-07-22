import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { selectGoalsLoading, selectGoalsError, } from "../../feature/goals/goalsSlice";

import type { AppDispatch, RootState } from "../../app/store";

import { updateGoal } from "../../feature/goals/goalsThunks";
import { api } from "../../services/api";

import "./EditGoal.css";

export default function EditGoal() {
    const { id } = useParams();

    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const loading = useSelector(selectGoalsLoading);
    const error = useSelector(selectGoalsError);

    const goal = useSelector((state: RootState) =>
        state.goals.goals.find((g) => g.id === Number(id))
    );

    const [categories, setCategories] = useState<
      { id: number; name: string }[]
    >([]);

    const [form, setForm] = useState({
     name: "",
     targetAmount: "",
     startDate: "",
     deadline: "",
     categoryId: "",
    });

    useEffect(() => {
      api.get("/categories").then((res) => setCategories(res.data));

    if (goal) {
        setForm({
         name: goal.name,
         targetAmount: String(goal.targetAmount),
         startDate: goal.startDate,
         deadline: goal.deadline,
         categoryId: goal.categoryId
            ? String(goal.categoryId)
            : "",
        });
        }
    }, [goal]);

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

     if (!goal) return;

     const result = await dispatch(
      updateGoal({
        id: goal.id,
        data: {
          name: form.name,
          targetAmount: Number(form.targetAmount),
          startDate: form.startDate,
          deadline: form.deadline,
          categoryId: form.categoryId
            ? Number(form.categoryId)
            : undefined,
         },
        })
     );

    if (updateGoal.fulfilled.match(result)) {
        navigate("/goals");
     }
    }

  return (
    <div className="edit-goal-container">

      <div className="edit-goal-box">

        <h1>Editar Meta Financeira</h1>

        <p className="subtitle">
          Atualize os dados da meta
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
            <label>Data de início *</label>

            <input
              type="date"
              name="startDate"
              value={form.startDate}
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
              {loading ? "Salvando..." : "Salvar Alterações"}
            </button>

          </div>

        </form>

      </div>

    </div>
  );
}
