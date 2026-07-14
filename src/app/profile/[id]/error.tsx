"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function ProfileErrorPage({ error, reset }: { error: Error; reset: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="container mx-auto px-4 py-12">
      <h2 className="font-display text-4xl md:text-5xl">Something went wrong</h2>
      <p className="text-muted-foreground mt-2 mb-6">We couldn't load this profile.</p>
      <div className="flex gap-3">
        <button onClick={() => reset()} className="text-primary hover:text-primary-glow transition">
          Try again
        </button>
        <Link
          href="/browse"
          className="text-muted-foreground hover:text-foreground transition"
        >
          Go to Browse
        </Link>
      </div>
    </div>
  );
}