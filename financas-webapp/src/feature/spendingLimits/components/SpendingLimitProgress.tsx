interface SpendingLimitProgressProps {
  limitAmount: number;
  spentAmount: number;
}

function SpendingLimitProgress({
  limitAmount,
  spentAmount,
}: SpendingLimitProgressProps) {
  const percentage =
    limitAmount > 0 ? (spentAmount / limitAmount) * 100 : 0;

  const displayedPercentage = Math.round(percentage);
  const barWidth = Math.min(percentage, 100);

  let color = "#22c55e";
  let status = "Dentro do limite";

  if (percentage >= 100) {
    color = "#ef4444";
    status = "Limite ultrapassado";
  } else if (percentage >= 80) {
    color = "#eab308";
    status = "Próximo do limite";
  }

  function formatCurrency(value: number) {
    return new Intl.NumberFormat("pt-BR", {
      style: "currency",
      currency: "BRL",
    }).format(value);
  }

  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          marginBottom: "8px",
        }}
      >
        <span>
          Gasto: <strong>{formatCurrency(spentAmount)}</strong>
        </span>

        <span>{displayedPercentage}%</span>
      </div>

      <div
        style={{
          width: "100%",
          height: "12px",
          backgroundColor: "#d1d5db",
          borderRadius: "999px",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            width: `${barWidth}%`,
            height: "100%",
            backgroundColor: color,
            borderRadius: "999px",
            transition: "width 0.3s ease",
          }}
        />
      </div>

      <p
        style={{
          color,
          fontWeight: 600,
          marginTop: "8px",
        }}
      >
        {status}
      </p>
    </div>
  );
}

export default SpendingLimitProgress;