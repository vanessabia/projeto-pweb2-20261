import { Link, useNavigate } from "react-router-dom";

import SpendingLimitForm from "../../feature/spendingLimits/components/SpendingLimitForm";

import "./SpendingLimits.css";

function NewSpendingLimit() {
  const navigate = useNavigate();

  function handleSuccess() {
    navigate("/spending-limits");
  }

  return (
    <main className="spending-limits-page">
      <header className="spending-limits-header">
        <div>
          <h1>Cadastrar limite de gastos</h1>

          <p>
            Defina um limite mensal para uma categoria.
          </p>
        </div>

        <Link
          to="/spending-limits"
          className="spending-limits-back"
        >
          Voltar
        </Link>
      </header>

      <div className="spending-limit-form-container">
        <SpendingLimitForm onSuccess={handleSuccess} />
      </div>
    </main>
  );
}

export default NewSpendingLimit;