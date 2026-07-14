import { useEffect } from "react";

const BASE = "Ficshelf";

export function usePageTitle(title?: string) {
  useEffect(() => {
    document.title = title ? `${title} · ${BASE}` : BASE;
  }, [title]);
}
