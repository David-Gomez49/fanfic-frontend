export function TableSkeleton({ cols, rows = 5 }: { cols: number; rows?: number }) {
  return (
    <div className="animate-pulse">
      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-border">
            {Array.from({ length: cols }).map((_, i) => (
              <th key={i} className="pb-3 pr-4">
                <div className="h-3 w-20 rounded bg-surface-2" />
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {Array.from({ length: rows }).map((_, r) => (
            <tr key={r} className="border-b border-border/50">
              {Array.from({ length: cols }).map((_, c) => (
                <td key={c} className="py-3 pr-4">
                  <div className="h-4 rounded bg-surface-2" style={{ width: `${40 + (c * 20) % 60}%` }} />
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CardSkeleton({ count = 3 }: { count?: number }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="rounded-xl border border-border bg-card p-4 animate-pulse">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <div className="h-3 w-48 rounded bg-surface-2" />
              <div className="h-3 w-32 rounded bg-surface-2" />
              <div className="h-3 w-full rounded bg-surface-2" />
            </div>
            <div className="h-8 w-8 rounded bg-surface-2 shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
