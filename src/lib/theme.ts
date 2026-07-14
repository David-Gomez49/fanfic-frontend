import { useSyncExternalStore } from "react";

export type Theme = "light" | "dark";
const KEY = "ficshelf:theme";

function getInitial(): Theme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem(KEY) as Theme | null;
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia?.("(prefers-color-scheme: dark)").matches ? "dark" : "light";
}

let current: Theme = typeof document !== "undefined" && document.documentElement.classList.contains("dark") ? "dark" : "light";
const listeners = new Set<() => void>();

function apply(t: Theme) {
  if (typeof document === "undefined") return;
  document.documentElement.classList.toggle("dark", t === "dark");
  document.documentElement.style.colorScheme = t;
}

export function setTheme(t: Theme) {
  current = t;
  if (typeof window !== "undefined") window.localStorage.setItem(KEY, t);
  apply(t);
  listeners.forEach((l) => l());
}

export function toggleTheme() {
  setTheme(current === "dark" ? "light" : "dark");
}

export function useTheme(): Theme {
  return useSyncExternalStore(
    (cb) => {
      listeners.add(cb);
      return () => listeners.delete(cb);
    },
    () => current,
    () => "dark",
  );
}
