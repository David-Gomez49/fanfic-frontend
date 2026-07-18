export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  isAdmin?: boolean;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterCredentials {
  username: string;
  password: string;
  email?: string;
}