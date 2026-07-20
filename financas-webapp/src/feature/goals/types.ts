export interface GoalRequest {
  name: string;
  targetAmount: number;
  deadline: string;
  categoryId?: number;
}

export interface GoalResponse {
  id: number;
  name: string;
  targetAmount: number;
  deadline: string;
  categoryId?: number;
}

export interface GoalsState {
  goals: GoalResponse[];
  loading: boolean;
  error: string | null;
}