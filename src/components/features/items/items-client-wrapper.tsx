"use client";

import { useState } from "react";
import { ItemCard, type ItemCardItem } from "./item-card";
import { ImageThumbnailCard } from "./image-thumbnail-card";
import { ItemDrawer } from "./item-drawer";

interface ItemsClientWrapperProps {
  items: ItemCardItem[];
  typeSlug?: string;
}

export function ItemsClientWrapper({ items, typeSlug }: ItemsClientWrapperProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const isImageGallery = typeSlug === "image";

  return (
    <>
      {isImageGallery ? (
        <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ImageThumbnailCard key={item.id} item={item} onOpen={setSelectedId} />
          ))}
        </div>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} onOpen={setSelectedId} />
          ))}
        </div>
      )}
      <ItemDrawer itemId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
