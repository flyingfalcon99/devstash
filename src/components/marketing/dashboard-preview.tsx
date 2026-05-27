const NAV_ITEMS = ["Dashboard", "Snippets", "Prompts", "Commands", "Notes", "Files"];

const CARDS = [
  { color: "#3b82f6" },
  { color: "#f59e0b" },
  { color: "#06b6d4" },
  { color: "#22c55e" },
  { color: "#ec4899" },
  { color: "#6366f1" },
];

export function DashboardPreview() {
  return (
    <div className="flex-1 rounded-xl border border-border bg-card overflow-hidden min-w-0">
      <p className="text-[10px] font-medium uppercase tracking-widest text-muted-foreground px-3 pt-3 pb-1">
        ...with DevStash
      </p>

      {/* Mini top bar */}
      <div className="flex items-center gap-2 px-3 py-1.5 bg-muted/50 border-b border-border">
        <div className="w-4 h-4 rounded bg-blue-500 opacity-70 shrink-0" />
        <div className="flex-1 h-3 rounded bg-border opacity-60" />
        <div className="w-4 h-4 rounded-full bg-border shrink-0" />
      </div>

      {/* Body */}
      <div className="flex gap-2 p-2" style={{ minHeight: 200 }}>
        {/* Sidebar */}
        <div className="w-20 shrink-0 bg-muted/40 rounded-lg p-1.5 flex flex-col gap-1">
          {NAV_ITEMS.map((label, i) => (
            <div
              key={label}
              className={`h-5 rounded px-1.5 flex items-center text-[7.5px] font-medium overflow-hidden whitespace-nowrap ${
                i === 0
                  ? "bg-blue-500/15 text-blue-400"
                  : "bg-border/60 text-muted-foreground"
              }`}
            >
              {label}
            </div>
          ))}
        </div>

        {/* Main */}
        <div className="flex-1 flex flex-col gap-1.5 min-w-0">
          {/* Stats */}
          <div className="flex gap-1">
            {["48 Items", "6 Collections", "12 Pinned"].map((s) => (
              <div
                key={s}
                className="flex-1 h-7 rounded-md border border-border bg-muted/30 flex items-center justify-center text-[7px] font-semibold text-muted-foreground"
              >
                {s}
              </div>
            ))}
          </div>

          {/* Section label */}
          <div className="text-[7px] font-bold uppercase tracking-widest text-muted-foreground/60">
            Recent Items
          </div>

          {/* Cards */}
          <div className="grid grid-cols-2 gap-1">
            {CARDS.map(({ color }, i) => (
              <div
                key={i}
                className="rounded-md bg-muted/40 border-t-2 p-1.5 flex flex-col gap-1"
                style={{ borderTopColor: color }}
              >
                <div className="h-1.5 rounded-full bg-border" />
                <div className="h-1.5 rounded-full bg-border w-3/5" />
                <div className="h-1.5 rounded-full bg-border w-2/5 opacity-50" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
