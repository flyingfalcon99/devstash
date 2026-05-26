"use client";

export function DrawerSkeleton() {
  return (
    <div className="p-5 pt-10 space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-5 bg-muted rounded w-2/3" />
        <div className="flex gap-2">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-12" />
        </div>
      </div>
      <div className="flex gap-2 py-3 border-y border-border">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 bg-muted rounded w-14" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-4/5" />
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-16 bg-muted rounded w-full" />
      </div>
    </div>
  );
}
