declare module "financas_summary_mfe/FinancialSummary" {
  import type { ComponentType } from "react";

  export interface FinancialSummaryProps {
    income: number;
    expense: number;
    totalTransactions: number;
  }

  const FinancialSummary: ComponentType<FinancialSummaryProps>;

  export default FinancialSummary;
}