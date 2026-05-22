"use client";

import { useState } from "react";
import { ItemCard, type ItemCardItem } from "./item-card";
import { ItemDrawer } from "./item-drawer";

interface ItemsClientWrapperProps {
  items: ItemCardItem[];
}

export function ItemsClientWrapper({ items }: ItemsClientWrapperProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <>
      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ItemCard key={item.id} item={item} onOpen={setSelectedId} />
        ))}
      </div>
      <ItemDrawer itemId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
