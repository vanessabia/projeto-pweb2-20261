export interface TransactionRequest {
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId: number;
  date: string;
  description?: string;
  tag?: string;
}

export interface TransactionResponse {
  id: number;
  amount: number;
  type: "INCOME" | "EXPENSE";
  categoryId: number;
  categoryName: string;
  date: string;
  description?: string;
  tag?: string;
}

export interface TransactionsState {
  transactions: TransactionResponse[];
  loading: boolean;
  error: string | null;
}
