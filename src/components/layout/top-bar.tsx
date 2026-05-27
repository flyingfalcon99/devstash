import Link from "next/link";
import { Search, Menu, Package } from "lucide-react";
import { Button } from "@/components/ui/button";
import { NewItemButton } from "@/components/features/items/new-item-button";
import { NewCollectionButton } from "@/components/features/collections/new-collection-button";

interface TopBarProps {
  onOpenMobile?: () => void;
  onOpenPalette?: () => void;
}

export function TopBar({ onOpenMobile, onOpenPalette }: TopBarProps) {
  return (
    <header className="flex items-center justify-between gap-4 border-b border-border px-4 py-3 shrink-0">
      <div className="flex items-center gap-2">
        {onOpenMobile && (
          <Button variant="ghost" size="icon" className="lg:hidden shrink-0" onClick={onOpenMobile}>
            <Menu className="h-5 w-5" />
          </Button>
        )}
        <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <Package className="h-5 w-5 text-primary" />
          <span className="text-lg font-semibold tracking-tight hidden sm:inline-block">DevStash</span>
        </Link>
      </div>

      <div className="flex-1 max-w-md">
        <button
          type="button"
          onClick={onOpenPalette}
          className="relative flex w-full items-center gap-2 rounded-md border border-border bg-muted/40 px-3 py-2 text-sm text-muted-foreground hover:bg-muted/60 transition-colors"
        >
          <Search className="h-4 w-4 shrink-0" />
          <span className="flex-1 text-left">Search items and collections…</span>
          <kbd className="hidden sm:inline-flex items-center gap-1 rounded border border-border bg-background px-1.5 py-0.5 text-xs font-mono text-muted-foreground">
            <span className="text-xs">⌘</span>K
          </kbd>
        </button>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <NewCollectionButton />
        <NewItemButton />
      </div>
    </header>
  );
}
