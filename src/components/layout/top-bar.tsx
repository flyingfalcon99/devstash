import { Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopBar() {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 shrink-0">
      <div className="flex items-center gap-2">
        <span className="text-lg font-semibold tracking-tight">DevStash</span>
      </div>

      <div className="flex-1 max-w-md">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-9 bg-muted/40 border-border"
          />
        </div>
      </div>

      <Button size="sm" className="gap-2">
        <Plus className="h-4 w-4" />
        New Item
      </Button>
    </header>
  );
}
