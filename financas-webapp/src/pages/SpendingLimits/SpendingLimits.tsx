import { Link } from "react-router-dom";

import SpendingLimitsList from "../../feature/spendingLimits/components/SpendingLimitsList";

import "./SpendingLimits.css";

function SpendingLimits() {
  return (
    <main className="spending-limits-page">
      <header className="spending-limits-header">
        <div>
          <h1>Limites de gastos</h1>
          <p>Gerencie seus limites mensais por categoria.</p>
        </div>

        <div className="spending-limits-actions">
          <Link
            to="/"
            className="spending-limits-back"
          >
            Voltar ao Dashboard
          </Link>

          <Link
            to="/spending-limits/new"
            className="spending-limits-link"
          >
            Cadastrar novo limite
          </Link>
        </div>
      </header>

      <SpendingLimitsList />
    </main>
  );
}

export default SpendingLimits;