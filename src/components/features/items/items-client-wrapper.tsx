"use client";

import { ItemCard, type ItemCardItem } from "./item-card";
import { ImageThumbnailCard } from "./image-thumbnail-card";
import { FileListRow } from "./file-list-row";
import { useItemDrawer } from "@/context/item-drawer-context";

interface ItemsClientWrapperProps {
  items: ItemCardItem[];
  typeSlug?: string;
}

export function ItemsClientWrapper({ items, typeSlug }: ItemsClientWrapperProps) {
  const { openItem } = useItemDrawer();
  const isImageGallery = typeSlug === "image";
  const isFileList = typeSlug === "file";

  if (isFileList) {
    return (
      <div className="flex flex-col gap-2">
        {items.map((item) => (
          <FileListRow key={item.id} item={item} onOpen={openItem} />
        ))}
      </div>
    );
  }

  if (isImageGallery) {
    return (
      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {items.map((item) => (
          <ImageThumbnailCard key={item.id} item={item} onOpen={openItem} />
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
      {items.map((item) => (
        <ItemCard key={item.id} item={item} onOpen={openItem} />
      ))}
    </div>
  );
}
