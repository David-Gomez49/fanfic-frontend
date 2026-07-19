"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { api } from "@/shared/lib/api-client";

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
  setUser: (user: User | null) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });
  const queryClient = useQueryClient();

  const fetchUser = useCallback(async () => {
    try {
      const user = await api.get<User>("/api/auth/me");
      setState({ user, loading: false });
    } catch {
      setState({ user: null, loading: false });
    }
  }, []);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  const login = async (username: string, password: string) => {
    await api.post<{ user: User }>("/api/auth/login", { username, password });
    await fetchUser();
  };

  const register = async (username: string, password: string) => {
    await api.post<{ user: User }>("/api/auth/register", { username, password });
    await fetchUser();
  };

  const logout = async () => {
    await api.post("/api/auth/logout").catch(() => {});
    queryClient.clear();
    setState({ user: null, loading: false });
  };

  const refetchUser = async () => {
    await fetchUser();
  };

  const setUser = (user: User | null) => {
    setState({ user, loading: false });
  };

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, refetchUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within an AuthProvider");
  return ctx;
}