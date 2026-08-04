import FinancialSummary from "./components/FinancialSummary/FinancialSummary";

function App() {
  return (
    <main
      style={{
        minHeight: "100vh",
        padding: "40px",
        background: "#0b0f17",
        boxSizing: "border-box",
      }}
    >
      <FinancialSummary
        income={134}
        expense={0}
        totalTransactions={1}
      />
    </main>
  );
}

export default App;