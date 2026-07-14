"use client";

import { createContext, useContext, useState, useCallback, useEffect, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "./api-client";

export interface User {
  id: string;
  name: string;
  email: string;
  image?: string | null;
  isAdmin?: boolean;
}

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, password: string) => Promise<void>;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });
  const queryClient = useQueryClient();

  useEffect(() => {
    api.get<{ id: string; name: string; email: string; image?: string | null }>("/api/auth/me")
      .then((user) => setState({ user, loading: false }))
      .catch(() => setState({ user: null, loading: false }));
  }, []);

  const login = useCallback(async (username: string, password: string) => {
    await api.post<{ user: User }>("/api/auth/login", { username, password });
    const user = await api.get<User>("/api/auth/me");
    setState({ user, loading: false });
  }, []);

  const register = useCallback(async (username: string, password: string) => {
    await api.post<{ user: User }>("/api/auth/register", { username, password });
    const user = await api.get<User>("/api/auth/me");
    setState({ user, loading: false });
  }, []);

  const logout = useCallback(async () => {
    await api.post("/api/auth/logout").catch(() => {});
    queryClient.clear();
    setState({ user: null, loading: false });
  }, [queryClient]);

  const refetchUser = useCallback(async () => {
    try {
      const user = await api.get<User>("/api/auth/me");
      setState({ user, loading: false });
    } catch {
      setState({ user: null, loading: false });
    }
  }, []);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth debe usarse dentro de <AuthProvider>");
  return ctx;
}
