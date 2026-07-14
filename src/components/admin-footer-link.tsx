"use client";
import { useAuth } from "@/lib/auth-context";
import Link from "next/link";

export function AdminFooterLink() {
  const { user } = useAuth();
  if (!user?.isAdmin) return null;
  return (
    <li>
      <Link href="/admin" className="text-sm text-foreground/70 hover:text-primary-glow transition">Admin</Link>
    </li>
  );
}
