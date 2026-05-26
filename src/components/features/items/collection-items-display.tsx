"use client";

import { useState } from "react";
import { ItemCard, type ItemCardItem } from "./item-card";
import { ImageThumbnailCard } from "./image-thumbnail-card";
import { FileListRow } from "./file-list-row";
import { ItemDrawer } from "./item-drawer";

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
      {children}
    </h2>
  );
}

interface CollectionItemsDisplayProps {
  items: ItemCardItem[];
}

export function CollectionItemsDisplay({ items }: CollectionItemsDisplayProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const cards = items.filter((i) => i.itemType.name !== "file" && i.itemType.name !== "image");
  const images = items.filter((i) => i.itemType.name === "image");
  const files = items.filter((i) => i.itemType.name === "file");

  const sectionCount = [cards, images, files].filter((g) => g.length > 0).length;
  const showLabels = sectionCount > 1;

  return (
    <>
      <div className="space-y-8">
        {cards.length > 0 && (
          <div className="space-y-3">
            {showLabels && <SectionLabel>Items</SectionLabel>}
            <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {cards.map((item) => (
                <ItemCard key={item.id} item={item} onOpen={setSelectedId} />
              ))}
            </div>
          </div>
        )}

        {images.length > 0 && (
          <div className="space-y-3">
            {showLabels && <SectionLabel>Images</SectionLabel>}
            <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {images.map((item) => (
                <ImageThumbnailCard key={item.id} item={item} onOpen={setSelectedId} />
              ))}
            </div>
          </div>
        )}

        {files.length > 0 && (
          <div className="space-y-3">
            {showLabels && <SectionLabel>Files</SectionLabel>}
            <div className="flex flex-col gap-2">
              {files.map((item) => (
                <FileListRow key={item.id} item={item} onOpen={setSelectedId} />
              ))}
            </div>
          </div>
        )}
      </div>

      <ItemDrawer itemId={selectedId} onClose={() => setSelectedId(null)} />
    </>
  );
}
