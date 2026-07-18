import { api } from "@/shared/lib/api-client";
import type { User, LoginCredentials, RegisterCredentials } from "./types";

export const authApi = {
  login: (credentials: LoginCredentials) =>
    api.post<{ user: User }>("/api/auth/login", credentials),

  register: (credentials: RegisterCredentials) =>
    api.post<{ user: User }>("/api/auth/register", credentials),

  logout: () => api.post("/api/auth/logout"),

  me: () => api.get<User>("/api/auth/me"),

  updateProfile: (data: { name?: string; email?: string }) =>
    api.patch<User>("/api/auth/me", data),
};