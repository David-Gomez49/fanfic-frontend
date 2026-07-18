import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api";
import type { LoginCredentials, RegisterCredentials } from "../types";

export function useLogin() {
  return useMutation({
    mutationFn: (credentials: LoginCredentials) => authApi.login(credentials),
  });
}

export function useRegister() {
  return useMutation({
    mutationFn: (credentials: RegisterCredentials) => authApi.register(credentials),
  });
}

export function useLogout() {
  return useMutation({
    mutationFn: () => authApi.logout(),
  });
}

export function useUpdateProfile() {
  return useMutation({
    mutationFn: (data: { name?: string; email?: string }) => authApi.updateProfile(data),
  });
}