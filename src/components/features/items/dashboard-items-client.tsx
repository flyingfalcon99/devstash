"use client";

import { useState } from "react";
import Link from "next/link";
import { ItemCard, type ItemCardItem } from "./item-card";
import { ItemDrawer } from "./item-drawer";

interface DashboardItemsClientProps {
  pinnedItems: ItemCardItem[];
  recentItems: ItemCardItem[];
}

export function DashboardItemsClient({ pinnedItems, recentItems }: DashboardItemsClientProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      {pinnedItems.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Pinned Items</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} onOpen={setSelectedId} />
            ))}
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Recent Items</h2>
          <Link href="/items" className="text-sm text-muted-foreground hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recentItems.map((item) => (
            <ItemCard key={item.id} item={item} onOpen={setSelectedId} />
          ))}
        </div>
      </div>

      <ItemDrawer itemId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
