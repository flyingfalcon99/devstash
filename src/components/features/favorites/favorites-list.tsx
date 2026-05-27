"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Layers } from "lucide-react";
import { itemTypeIconMap } from "@/lib/constants/item-types";
import { ItemDrawer } from "@/components/features/items/item-drawer";

interface FavoriteItem {
  id: string;
  title: string;
  updatedAt: Date;
  itemType: { name: string; icon: string; color: string };
}

interface FavoriteCollection {
  id: string;
  name: string;
  updatedAt: Date;
}

interface FavoritesListProps {
  items: FavoriteItem[];
  collections: FavoriteCollection[];
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FavoritesList({ items, collections }: FavoritesListProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const isEmpty = items.length === 0 && collections.length === 0;

  if (isEmpty) {
    return (
      <div className="flex flex-col items-center justify-center py-24 gap-3 text-center">
        <Star className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm font-mono text-muted-foreground">No favorites yet.</p>
        <p className="text-xs font-mono text-muted-foreground/60">
          Star items and collections to find them here.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="space-y-6">
        {items.length > 0 && (
          <section>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1 px-2">
              Items <span className="text-muted-foreground/50">({items.length})</span>
            </p>
            <div className="divide-y divide-border/50">
              {items.map((item) => {
                const Icon = itemTypeIconMap[item.itemType.icon as keyof typeof itemTypeIconMap];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelectedId(item.id)}
                    className="w-full flex items-center gap-3 px-2 py-2 text-left hover:bg-muted/50 transition-colors group"
                  >
                    <span className="shrink-0" style={{ color: item.itemType.color }}>
                      {Icon ? <Icon className="h-3.5 w-3.5" /> : null}
                    </span>
                    <span className="flex-1 font-mono text-sm truncate group-hover:text-foreground text-foreground/90">
                      {item.title}
                    </span>
                    <span className="shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded border border-border/60 text-muted-foreground capitalize">
                      {item.itemType.name}
                    </span>
                    <span className="shrink-0 font-mono text-[11px] text-muted-foreground/60 w-24 text-right">
                      {formatDate(item.updatedAt)}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>
        )}

        {collections.length > 0 && (
          <section>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1 px-2">
              Collections <span className="text-muted-foreground/50">({collections.length})</span>
            </p>
            <div className="divide-y divide-border/50">
              {collections.map((col) => (
                <Link
                  key={col.id}
                  href={`/collections/${col.id}`}
                  className="w-full flex items-center gap-3 px-2 py-2 hover:bg-muted/50 transition-colors group"
                >
                  <span className="shrink-0 text-muted-foreground">
                    <Layers className="h-3.5 w-3.5" />
                  </span>
                  <span className="flex-1 font-mono text-sm truncate group-hover:text-foreground text-foreground/90">
                    {col.name}
                  </span>
                  <span className="shrink-0 font-mono text-[10px] px-1.5 py-0.5 rounded border border-border/60 text-muted-foreground">
                    collection
                  </span>
                  <span className="shrink-0 font-mono text-[11px] text-muted-foreground/60 w-24 text-right">
                    {formatDate(col.updatedAt)}
                  </span>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>

      <ItemDrawer itemId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
