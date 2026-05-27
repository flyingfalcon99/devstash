"use client";

import { useState } from "react";
import Link from "next/link";
import { Star, Layers } from "lucide-react";
import { cn } from "@/lib/utils";
import { itemTypeIconMap } from "@/lib/constants/item-types";
import { useItemDrawer } from "@/context/item-drawer-context";

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

type SortKey = "date" | "name" | "type";

const SORT_OPTIONS: { key: SortKey; label: string }[] = [
  { key: "date", label: "Date" },
  { key: "name", label: "Name" },
  { key: "type", label: "Type" },
];

export function sortItems(list: FavoriteItem[], sort: SortKey): FavoriteItem[] {
  return [...list].sort((a, b) => {
    if (sort === "name") return a.title.localeCompare(b.title);
    if (sort === "type")
      return a.itemType.name.localeCompare(b.itemType.name) || a.title.localeCompare(b.title);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

export function sortCollections(list: FavoriteCollection[], sort: SortKey): FavoriteCollection[] {
  return [...list].sort((a, b) => {
    if (sort === "name" || sort === "type") return a.name.localeCompare(b.name);
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  });
}

function formatDate(date: Date) {
  return new Date(date).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function FavoritesList({ items, collections }: FavoritesListProps) {
  const { openItem } = useItemDrawer();
  const [sort, setSort] = useState<SortKey>("date");

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

  const sortedItems = sortItems(items, sort);
  const sortedCollections = sortCollections(collections, sort);

  return (
    <>
      <div className="space-y-6">
        {/* Sort controls */}
        <div className="flex items-center gap-2 px-2">
          <span className="font-mono text-[10px] text-muted-foreground/60 uppercase tracking-widest">
            Sort:
          </span>
          <div className="flex items-center gap-1">
            {SORT_OPTIONS.map(({ key, label }) => (
              <button
                key={key}
                type="button"
                onClick={() => setSort(key)}
                className={cn(
                  "font-mono text-[10px] px-2 py-0.5 rounded border transition-colors",
                  sort === key
                    ? "border-border bg-muted text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground hover:border-border/50"
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {sortedItems.length > 0 && (
          <section>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1 px-2">
              Items <span className="text-muted-foreground/50">({sortedItems.length})</span>
            </p>
            <div className="divide-y divide-border/50">
              {sortedItems.map((item) => {
                const Icon = itemTypeIconMap[item.itemType.icon as keyof typeof itemTypeIconMap];
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => openItem(item.id)}
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

        {sortedCollections.length > 0 && (
          <section>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest mb-1 px-2">
              Collections <span className="text-muted-foreground/50">({sortedCollections.length})</span>
            </p>
            <div className="divide-y divide-border/50">
              {sortedCollections.map((col) => (
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

    </>
  );
}
