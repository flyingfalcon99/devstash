"use client";

import { createContext, useContext, useState } from "react";
import { ItemDrawer } from "@/components/features/items/item-drawer";

interface ItemDrawerContextValue {
  openItem: (id: string) => void;
}

const ItemDrawerContext = createContext<ItemDrawerContextValue | null>(null);

export function ItemDrawerProvider({ children }: { children: React.ReactNode }) {
  const [selectedItemId, setSelectedItemId] = useState<string | null>(null);

  return (
    <ItemDrawerContext.Provider value={{ openItem: setSelectedItemId }}>
      {children}
      <ItemDrawer itemId={selectedItemId} onClose={() => setSelectedItemId(null)} />
    </ItemDrawerContext.Provider>
  );
}

export function useItemDrawer() {
  const ctx = useContext(ItemDrawerContext);
  if (!ctx) throw new Error("useItemDrawer must be used within ItemDrawerProvider");
  return ctx;
}
