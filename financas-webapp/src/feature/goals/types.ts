export interface GoalRequest {
  name: string;
  targetAmount: number;
  startDate: string;
  deadline: string;
  categoryId?: number;
}

export interface GoalResponse {
  id: number;
  name: string;
  targetAmount: number;
  startDate: string;
  deadline: string;
  categoryId?: number;
  categoryName?: string;
}

export interface GoalsState {
  goals: GoalResponse[];
  loading: boolean;
  error: string | null;
}