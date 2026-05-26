"use client";

import { ImageIcon } from "lucide-react";
import type { ItemCardItem } from "./item-card";

interface ImageThumbnailCardProps {
  item: ItemCardItem;
  onOpen?: (id: string) => void;
}

export function ImageThumbnailCard({ item, onOpen }: ImageThumbnailCardProps) {
  return (
    <button
      type="button"
      onClick={() => onOpen?.(item.id)}
      className="w-full text-left group rounded-lg overflow-hidden border border-border bg-muted/30 hover:border-ring/50 transition-colors"
    >
      <div className="aspect-video overflow-hidden bg-muted relative">
        {item.fileUrl ? (
          <img
            src={`/api/files/${item.fileUrl}`}
            alt={item.title}
            loading="lazy"
            decoding="async"
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <ImageIcon className="h-8 w-8 text-muted-foreground/40" />
          </div>
        )}
      </div>
      <div className="px-3 py-2">
        <p className="text-sm font-medium truncate">{item.title}</p>
        {item.description && (
          <p className="text-xs text-muted-foreground truncate mt-0.5">{item.description}</p>
        )}
      </div>
    </button>
  );
}
