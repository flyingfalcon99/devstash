import Link from "next/link";
import { Search, Plus, Menu, Package, FolderPlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function TopBar({ onOpenMobile }: { onOpenMobile?: () => void }) {
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
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search items..."
            className="pl-9 bg-muted/40 border-border"
          />
        </div>
      </div>

      <div className="flex items-center gap-2 shrink-0">
        <Button variant="outline" size="sm" className="gap-2 hidden sm:flex">
          <FolderPlus className="h-4 w-4" />
          New Collection
        </Button>
        <Button size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          New Item
        </Button>
      </div>
    </header>
  );
}
