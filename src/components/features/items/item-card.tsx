"use client";

import { useState } from "react";
import { File, Star, Clock, Copy, Check } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { itemTypeIconMap } from "@/lib/constants/item-types";

export interface ItemCardItem {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  isFavorite: boolean;
  language: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  createdAt: Date;
  itemType: {
    name: string;
    icon: string;
    color: string;
  };
}

interface ItemCardProps {
  item: ItemCardItem;
  onOpen?: (id: string) => void;
}

export function ItemCard({ item, onOpen }: ItemCardProps) {
  const [copied, setCopied] = useState(false);
  const Icon = itemTypeIconMap[item.itemType.icon as keyof typeof itemTypeIconMap] || File;
  const color = item.itemType.color;
  const copyValue = item.content ?? item.url;

  function handleCopy(e: React.MouseEvent) {
    e.stopPropagation();
    if (!copyValue) return;
    navigator.clipboard.writeText(copyValue).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }

  return (
    <button
      type="button"
      onClick={() => onOpen?.(item.id)}
      className="w-full text-left block"
    >
      <Card
        className="hover:bg-muted/50 transition-colors shadow-sm h-full flex flex-col"
        style={{ borderLeftColor: color, borderLeftWidth: "3px" }}
      >
        <CardHeader className="p-4 pb-2 flex-1">
          <div className="flex justify-between items-start mb-2">
            <div className="flex items-center gap-2 max-w-[80%]">
              <Icon className="h-4 w-4 shrink-0" style={{ color }} />
              <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {copyValue && (
                <span
                  role="button"
                  onClick={handleCopy}
                  className="p-0.5 rounded text-muted-foreground hover:text-foreground transition-colors"
                  aria-label="Copy"
                >
                  {copied
                    ? <Check className="h-3 w-3 text-green-500" />
                    : <Copy className="h-3 w-3" />}
                </span>
              )}
              {item.isFavorite && (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              )}
            </div>
          </div>
          <CardDescription className="text-xs line-clamp-2">
            {item.description || "No description"}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-xs text-muted-foreground flex items-center justify-between mt-auto">
          <div className="flex items-center gap-1.5">
            <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal capitalize">
              {item.itemType.name}
            </Badge>
            {item.language && (
              <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                {item.language}
              </Badge>
            )}
          </div>
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>
              {new Date(item.createdAt).toLocaleDateString(undefined, {
                month: "short",
                day: "numeric",
              })}
            </span>
          </div>
        </CardContent>
      </Card>
    </button>
  );
}
