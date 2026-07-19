"use client";

import { useState } from "react";
import Link from "next/link";
import { LogOut } from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import { ConfirmModal } from "@/shared/components/common/confirm-modal";

export function UserMenu() {
  const { user, logout } = useAuth();
  const [showConfirm, setShowConfirm] = useState(false);

  return (
    <>
      <div className="flex items-center gap-2">
        <Link
          href="/profile"
          className="grid h-8 w-8 place-items-center rounded-full bg-gradient-primary shadow-glow text-primary-foreground text-xs font-semibold cursor-pointer"
          aria-label="Profile"
          title="Profile"
        >
          {user?.name?.[0]?.toUpperCase()}
        </Link>

        <button
          onClick={() => setShowConfirm(true)}
          className="grid h-8 w-8 place-items-center rounded-full bg-destructive/10 text-destructive hover:bg-destructive/20 transition-colors cursor-pointer"
          aria-label="Sign out"
          title="Sign out"
        >
          <LogOut className="h-4 w-4" />
        </button>
      </div>

      <ConfirmModal
        open={showConfirm}
        onOpenChange={setShowConfirm}
        title="Sign out"
        description="Are you sure you want to sign out?"
        confirmLabel="Sign out"
        onConfirm={logout}
      />
    </>
  );
}
