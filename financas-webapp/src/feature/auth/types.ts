export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  name: string;
}

export interface AuthResponse {
  token: string;
  id: number;
  username: string;
  name: string;
}

export interface AuthState {
  user: AuthResponse | null;
  loading: boolean;
  error: string | null;
}