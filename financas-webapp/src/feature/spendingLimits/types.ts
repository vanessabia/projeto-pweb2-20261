export interface CategoryResponse {
  id: number;
  name: string;
}

export interface SpendingLimitRequest {
  limitAmount: number;
  categoryId: number;
}

export interface SpendingLimitResponse {
  id: number;
  limitAmount: number;
  categoryId: number;
  categoryName: string;
}

export interface SpendingLimitsState {
  spendingLimits: SpendingLimitResponse[];
  categories: CategoryResponse[];
  loading: boolean;
  categoriesLoading: boolean;
  error: string | null;
}