"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => { console.error(error); }, [error]);

  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="text-6xl font-display text-destructive">!</div>
        <h1 className="font-display text-3xl">Something went wrong</h1>
        <p className="text-muted-foreground text-sm">
          {error.message || "An unexpected error occurred."}
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Button onClick={reset} className="bg-gradient-primary shadow-glow">
            Try again
          </Button>
          <Button variant="outline" asChild className="border-border">
            <Link href="/">Go home</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
