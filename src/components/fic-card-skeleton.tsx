export function FicCardSkeleton() {
  return (
    <div className="flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-card animate-pulse">
      <div className="p-5 pb-0">
        <div className="flex items-center gap-2">
          <div className="h-5 w-16 rounded-full bg-surface-2" />
          <div className="h-5 w-20 rounded-full bg-surface-2" />
        </div>
      </div>
      <div className="flex flex-1 flex-col gap-3 p-5 pt-3">
        <div>
          <div className="h-3 w-24 rounded bg-surface-2 mb-2" />
          <div className="h-5 w-3/4 rounded bg-surface-2 mb-1" />
          <div className="h-3 w-1/3 rounded bg-surface-2 mt-2" />
        </div>
        <div className="space-y-2">
          <div className="h-3 w-full rounded bg-surface-2" />
          <div className="h-3 w-5/6 rounded bg-surface-2" />
          <div className="h-3 w-2/3 rounded bg-surface-2" />
        </div>
        <div className="flex gap-1.5 mt-auto">
          <div className="h-4 w-14 rounded-full bg-surface-2" />
          <div className="h-4 w-12 rounded-full bg-surface-2" />
          <div className="h-4 w-16 rounded-full bg-surface-2" />
        </div>
      </div>
      <div className="flex items-center justify-between px-5 py-3 border-t border-border">
        <div className="flex gap-3">
          <div className="h-3 w-10 rounded bg-surface-2" />
          <div className="h-3 w-10 rounded bg-surface-2" />
          <div className="h-3 w-10 rounded bg-surface-2" />
        </div>
        <div className="h-8 w-8 rounded-full bg-surface-2" />
      </div>
    </div>
  );
}

export function FicCardListSkeleton() {
  return (
    <div className="bg-card border border-border rounded-xl p-6 animate-pulse">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2 flex-1">
          <div className="h-5 w-2/3 rounded bg-surface-2" />
          <div className="h-3 w-1/3 rounded bg-surface-2" />
          <div className="h-3 w-1/4 rounded bg-surface-2 mt-1" />
        </div>
        <div className="flex gap-2">
          <div className="h-5 w-16 rounded-full bg-surface-2" />
          <div className="h-5 w-20 rounded-full bg-surface-2" />
        </div>
      </div>
      <div className="space-y-2 mb-4">
        <div className="h-3 w-full rounded bg-surface-2" />
        <div className="h-3 w-4/5 rounded bg-surface-2" />
      </div>
      <div className="flex gap-2 mb-4">
        <div className="h-5 w-16 rounded-full bg-surface-2" />
        <div className="h-5 w-20 rounded-full bg-surface-2" />
        <div className="h-5 w-14 rounded-full bg-surface-2" />
      </div>
      <div className="flex justify-between pt-4 border-t border-border">
        <div className="flex gap-4">
          <div className="h-3 w-16 rounded bg-surface-2" />
          <div className="h-3 w-10 rounded bg-surface-2" />
          <div className="h-3 w-10 rounded bg-surface-2" />
          <div className="h-3 w-10 rounded bg-surface-2" />
        </div>
        <div className="h-8 w-8 rounded-full bg-surface-2" />
      </div>
    </div>
  );
}

export function FicDetailSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="relative overflow-hidden bg-hero border-b border-border">
        <div className="container mx-auto px-4 py-12">
          <div className="h-4 w-20 rounded bg-surface-2 mb-6" />
          <div className="max-w-3xl">
            <div className="flex gap-2 mb-4">
              <div className="h-5 w-20 rounded-full bg-surface-2" />
              <div className="h-5 w-12 rounded-full bg-surface-2" />
              <div className="h-4 w-40 rounded bg-surface-2" />
            </div>
            <div className="h-10 w-4/5 rounded bg-surface-2 mb-3" />
            <div className="h-4 w-1/4 rounded bg-surface-2 mb-6" />
            <div className="flex gap-4 mb-6 flex-wrap">
              <div className="h-8 w-36 rounded bg-surface-2" />
              <div className="h-8 w-32 rounded bg-surface-2" />
              <div className="h-8 w-36 rounded bg-surface-2" />
              <div className="h-8 w-24 rounded bg-surface-2" />
            </div>
            <div className="flex gap-6 mb-6">
              <div className="h-4 w-20 rounded bg-surface-2" />
              <div className="h-4 w-24 rounded bg-surface-2" />
              <div className="h-4 w-16 rounded bg-surface-2" />
            </div>
            <div className="h-3 w-48 rounded bg-surface-2 mb-1" />
            <div className="h-3 w-36 rounded bg-surface-2 mb-6" />
            <div className="space-y-3">
              <div className="h-4 w-full rounded bg-surface-2" />
              <div className="h-4 w-5/6 rounded bg-surface-2" />
              <div className="h-4 w-4/5 rounded bg-surface-2" />
              <div className="h-4 w-3/4 rounded bg-surface-2" />
            </div>
          </div>
        </div>
      </div>
      <div className="container mx-auto px-4 py-14 max-w-3xl">
        <div className="h-6 w-32 rounded bg-surface-2 mb-6" />
        <div className="h-24 rounded-2xl bg-surface-2 mb-6" />
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-20 rounded-xl bg-surface-2" />
          ))}
        </div>
      </div>
    </div>
  );
}