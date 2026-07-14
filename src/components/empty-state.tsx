import type { LucideIcon } from "lucide-react";
import Link from "next/link";

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: { label: string; href: string };
}) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 rounded-2xl border border-dashed border-border">
      <Icon className="h-12 w-12 text-muted-foreground/40 mb-4" />
      <p className="text-base font-medium text-foreground">{title}</p>
      {description && <p className="text-sm text-muted-foreground mt-1">{description}</p>}
      {action && (
        <Link href={action.href} className="mt-4 text-sm text-primary-glow hover:underline">
          {action.label}
        </Link>
      )}
    </div>
  );
}
