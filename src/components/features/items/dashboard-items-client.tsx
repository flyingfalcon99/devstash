"use client";

import Link from "next/link";
import { ItemCard, type ItemCardItem } from "./item-card";
import { useItemDrawer } from "@/context/item-drawer-context";

interface DashboardItemsClientProps {
  pinnedItems: ItemCardItem[];
  recentItems: ItemCardItem[];
}

export function DashboardItemsClient({ pinnedItems, recentItems }: DashboardItemsClientProps) {
  const { openItem } = useItemDrawer();

  return (
    <>
      {pinnedItems.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold tracking-tight">Pinned Items</h2>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {pinnedItems.map((item) => (
              <ItemCard key={item.id} item={item} onOpen={openItem} />
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
            <ItemCard key={item.id} item={item} onOpen={openItem} />
          ))}
        </div>
      </div>
    </>
  );
}
