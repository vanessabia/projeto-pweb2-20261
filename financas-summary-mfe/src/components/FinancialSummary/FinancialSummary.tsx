import "./FinancialSummary.css";

interface FinancialSummaryProps {
  income: number;
  expense: number;
  totalTransactions: number;
}

function formatCurrency(value: number) {
  return value.toLocaleString("pt-BR", {
    style: "currency",
    currency: "BRL",
  });
}

function FinancialSummary({
  income,
  expense,
  totalTransactions,
}: FinancialSummaryProps) {
  return (
    <section className="financial-summary">
      <div className="financial-summary-card financial-summary-income">
        <span>Receitas</span>
        <h2>{formatCurrency(income)}</h2>
      </div>

      <div className="financial-summary-card financial-summary-expense">
        <span>Despesas</span>
        <h2>{formatCurrency(expense)}</h2>
      </div>

      <div className="financial-summary-card financial-summary-total">
        <span>Total Transações</span>
        <h2>{totalTransactions}</h2>
      </div>
    </section>
  );
}

export default FinancialSummary;