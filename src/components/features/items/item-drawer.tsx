"use client";

import { useEffect, useState } from "react";
import { Star, Pin, Copy, Pencil, Trash2, File } from "lucide-react";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { itemTypeIconMap } from "@/lib/constants/item-types";
import { cn } from "@/lib/utils";

interface ItemDetail {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  itemType: { name: string; icon: string; color: string };
  tags: { id: string; name: string }[];
  collections: { collection: { id: string; name: string } }[];
}

interface ItemDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

export function ItemDrawer({ itemId, onClose }: ItemDrawerProps) {
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!itemId) return;
    setLoading(true);
    fetch(`/api/items/${itemId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data) => {
        if (data) setItem(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, [itemId]);

  return (
    <Sheet open={itemId !== null} onOpenChange={(open) => { if (!open) onClose(); }}>
      <SheetContent side="right" className="p-0 gap-0 overflow-hidden flex flex-col sm:max-w-[480px]">
        {loading || !item ? (
          <DrawerSkeleton />
        ) : (
          <DrawerBody item={item} />
        )}
      </SheetContent>
    </Sheet>
  );
}

function DrawerSkeleton() {
  return (
    <div className="p-5 pt-10 space-y-5 animate-pulse">
      <div className="space-y-2">
        <div className="h-5 bg-muted rounded w-2/3" />
        <div className="flex gap-2">
          <div className="h-4 bg-muted rounded w-16" />
          <div className="h-4 bg-muted rounded w-12" />
        </div>
      </div>
      <div className="flex gap-2 py-3 border-y border-border">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-7 bg-muted rounded w-14" />
        ))}
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-3 bg-muted rounded w-full" />
        <div className="h-3 bg-muted rounded w-4/5" />
      </div>
      <div className="space-y-3">
        <div className="h-3 bg-muted rounded w-1/4" />
        <div className="h-16 bg-muted rounded w-full" />
      </div>
    </div>
  );
}

function DrawerBody({ item }: { item: ItemDetail }) {
  const Icon = itemTypeIconMap[item.itemType.icon as keyof typeof itemTypeIconMap] || File;
  const color = item.itemType.color;

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header */}
      <div className="px-5 pt-10 pb-3 pr-12">
        <div className="flex items-center gap-2 mb-2">
          <Icon className="h-4 w-4 shrink-0" style={{ color }} />
          <SheetTitle className="text-base font-semibold leading-tight">{item.title}</SheetTitle>
        </div>
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
      </div>

      {/* Action bar */}
      <div className="flex items-center gap-0.5 px-3 py-2 border-y border-border">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-7 px-2 text-xs gap-1.5", item.isFavorite && "text-yellow-500")}
        >
          <Star className={cn("h-3.5 w-3.5", item.isFavorite && "fill-yellow-400 text-yellow-400")} />
          Favorite
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5">
          <Pin className="h-3.5 w-3.5" />
          Pin
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5">
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5">
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      {/* Scrollable body */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-5 text-sm">
        {item.description && (
          <section className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Description</p>
            <p>{item.description}</p>
          </section>
        )}

        {item.content && (
          <section className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Content</p>
            <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-words font-mono">
              {item.content}
            </pre>
          </section>
        )}

        {item.url && (
          <section className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">URL</p>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline break-all text-xs"
            >
              {item.url}
            </a>
          </section>
        )}

        {item.tags.length > 0 && (
          <section className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Tags</p>
            <div className="flex flex-wrap gap-1.5">
              {item.tags.map((tag) => (
                <Badge key={tag.id} variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                  {tag.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        {item.collections.length > 0 && (
          <section className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Collections</p>
            <div className="flex flex-wrap gap-1.5">
              {item.collections.map(({ collection }) => (
                <Badge key={collection.id} variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                  {collection.name}
                </Badge>
              ))}
            </div>
          </section>
        )}

        <section className="space-y-1.5">
          <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Details</p>
          <div className="space-y-1 text-xs text-muted-foreground">
            <div className="flex items-center justify-between">
              <span>Created</span>
              <span>
                {new Date(item.createdAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Updated</span>
              <span>
                {new Date(item.updatedAt).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
