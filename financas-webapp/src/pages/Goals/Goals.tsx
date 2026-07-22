import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { fetchTransactions } from "../../feature/transactions/transactionsThunks";

import type { AppDispatch } from "../../app/store";

import { fetchGoals, deleteGoal, } from "../../feature/goals/goalsThunks";
import { selectGoals, selectGoalsLoading, } from "../../feature/goals/goalsSlice";

import { selectGoalsProgress } from "../../feature/goals/goalSelectors";

import "./Goals.css";

export default function Goals() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const goals = useSelector(selectGoals);
  const loading = useSelector(selectGoalsLoading);
  const goalsProgress = useSelector(selectGoalsProgress);

  const handleDelete = async (id: number) => {
   const confirmDelete = window.confirm(
     "Deseja realmente excluir esta meta?"
   );

   if (!confirmDelete) return;

   await dispatch(deleteGoal(id));

   dispatch(fetchGoals());
  };

  const transactions = useSelector(
    (state: any) => state.transactions.transactions
  );

  console.log("Goals:", goals);
  console.log("Transactions:", transactions);
  console.log("Progress:", goalsProgress);
  
  useEffect(() => {
    dispatch(fetchGoals());
    dispatch(fetchTransactions());
  }, [dispatch]);

  return (
    <div className="goals-container">
      <div className="goals-header">
        <div>
          <h1>Metas Financeiras</h1>
          <p>Gerencie suas metas de economia</p>
        </div>

        <div>
          <button
            className="back-button"
            onClick={() => navigate("/")}
          >
            Voltar
          </button>

          <button
            className="new-goal-btn"
            onClick={() => navigate("/goals/new")}
          >
            Nova Meta
          </button>
        </div>
      </div>

      {loading && <p className="loading">Carregando...</p>}

      <div className="table-wrapper">
        <table className="goals-table">
          <thead>
            <tr>
              <th>Nome</th>
              <th>Valor-alvo</th>
              <th>Data-limite</th>
              <th>Categoria</th>
              <th>Progresso</th>
              <th>Ações</th>
            </tr>
          </thead>

          <tbody>
            {goals.map((goal) => {
              const progress =
                goalsProgress.find((g) => g.id === goal.id)?.progress ?? 0;

              return (
                <tr key={goal.id}>
                  <td>{goal.name}</td>

                  <td>
                    R$ {goal.targetAmount.toFixed(2)}
                  </td>

                  <td>{goal.deadline}</td>

                  <td>{goal.categoryName ?? "-"}</td>

                  <td>
                    <div className="progress-container">
                      <div
                        className="progress-bar"
                        style={{ width: `${progress}%` }}
                      ></div>
                    </div>

                    <span className="progress-text">
                      {progress.toFixed(0)}%
                    </span>
                  </td>

                  <td>
                    <div className="actions">
                      <button
                        className="edit-btn"
                        onClick={() => navigate(`/goals/edit/${goal.id}`)}
                      >
                        Editar
                      </button>

                      <button
                        className="delete-btn"
                        onClick={() => handleDelete(goal.id)}
                      >
                        Excluir
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {!loading && goals.length === 0 && (
          <p className="empty-message">
            Nenhuma meta cadastrada.
          </p>
        )}
      </div>
    </div>
  );
}