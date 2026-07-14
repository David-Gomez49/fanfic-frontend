import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="container mx-auto px-4 py-24 text-center">
      <div className="max-w-md mx-auto space-y-4">
        <div className="text-6xl font-display text-muted-foreground">404</div>
        <h1 className="font-display text-3xl">Page not found</h1>
        <p className="text-muted-foreground text-sm">
          This page doesn't exist or it may have been removed.
        </p>
        <div className="flex justify-center gap-3 pt-4">
          <Button variant="outline" asChild className="border-border">
            <Link href="/">Go home</Link>
          </Button>
          <Button asChild className="bg-gradient-primary shadow-glow">
            <Link href="/browse">Browse catalog</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
