"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { DrawerSkeleton } from "./drawer-skeleton";
import { DrawerViewBody } from "./drawer-view-body";
import { DrawerEditBody } from "./drawer-edit-body";
import type { ItemDetail } from "./item-types";

export type { ItemDetail };

interface ItemDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

export function ItemDrawer({ itemId, onClose }: ItemDrawerProps) {
  const router = useRouter();
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");

  async function fetchItem(id: string, signal?: AbortSignal) {
    setLoading(true);
    try {
      const res = await fetch(`/api/items/${id}`, { signal });
      const data = res.ok ? await res.json() : null;
      if (data) setItem(data);
    } catch (e) {
      if ((e as Error).name === "AbortError") return;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!itemId) return;
    setMode("view");
    const controller = new AbortController();
    fetchItem(itemId, controller.signal);
    return () => controller.abort();
  }, [itemId]);

  function handleSaveSuccess() {
    setMode("view");
    router.refresh();
    if (itemId) fetchItem(itemId);
  }

  return (
    <Sheet open={itemId !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="right" className="p-0 gap-0 overflow-hidden flex flex-col sm:max-w-[480px]">
        {loading || !item ? (
          <DrawerSkeleton />
        ) : mode === "edit" ? (
          <DrawerEditBody
            item={item}
            onSaveSuccess={handleSaveSuccess}
            onCancel={() => setMode("view")}
          />
        ) : (
          <DrawerViewBody item={item} onEdit={() => setMode("edit")} onClose={onClose} />
        )}
      </SheetContent>
    </Sheet>
  );
}
