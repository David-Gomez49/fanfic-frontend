"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/lib/auth-context";

export default function ProfileRedirect() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading) {
      if (user) {
        router.replace(`/profile/${user.id}`);
      } else {
        router.replace("/browse");
      }
    }
  }, [user, loading, router]);

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex items-center gap-6 mb-12 animate-pulse">
        <div className="h-24 w-24 rounded-3xl bg-surface-2" />
        <div className="space-y-2">
          <div className="h-8 w-48 rounded bg-surface-2" />
          <div className="h-4 w-36 rounded bg-surface-2" />
        </div>
      </div>
    </div>
  );
}
