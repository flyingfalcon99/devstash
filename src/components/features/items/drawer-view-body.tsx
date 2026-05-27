"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Pin, Copy, Pencil, Trash2, File, Download } from "lucide-react";
import { toast } from "sonner";
import { SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { itemTypeIconMap } from "@/lib/constants/item-types";
import { cn, formatBytes } from "@/lib/utils";
import { deleteItem, toggleItemFavorite, toggleItemPin } from "@/actions/items";
import { ItemContentField } from "./item-content-field";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import type { ItemDetail } from "./item-types";

interface DrawerViewBodyProps {
  item: ItemDetail;
  onEdit: () => void;
  onClose: () => void;
}

export function DrawerViewBody({ item, onEdit, onClose }: DrawerViewBodyProps) {
  const router = useRouter();
  const Icon = itemTypeIconMap[item.itemType.icon as keyof typeof itemTypeIconMap] || File;
  const color = item.itemType.color;
  const [isFavorite, setIsFavorite] = useState(item.isFavorite);
  const [togglingFavorite, setTogglingFavorite] = useState(false);
  const [isPinned, setIsPinned] = useState(item.isPinned);
  const [togglingPin, setTogglingPin] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  async function handleToggleFavorite() {
    setTogglingFavorite(true);
    setIsFavorite((prev) => !prev);
    const result = await toggleItemFavorite(item.id);
    if (result.success) {
      router.refresh();
    } else {
      setIsFavorite((prev) => !prev);
      toast.error(result.error ?? "Failed to update favorite");
    }
    setTogglingFavorite(false);
  }

  async function handleTogglePin() {
    setTogglingPin(true);
    setIsPinned((prev) => !prev);
    const result = await toggleItemPin(item.id);
    if (result.success) {
      router.refresh();
    } else {
      setIsPinned((prev) => !prev);
      toast.error(result.error ?? "Failed to update pin");
    }
    setTogglingPin(false);
  }

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteItem(item.id);
    if (result.success) {
      toast.success("Item deleted");
      router.refresh();
      onClose();
    } else {
      toast.error(result.error ?? "Failed to delete item");
      setDeleting(false);
    }
    setDeleteOpen(false);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
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

      <div className="flex items-center gap-0.5 px-3 py-2 border-y border-border">
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-7 px-2 text-xs gap-1.5", isFavorite && "text-yellow-500")}
          onClick={handleToggleFavorite}
          disabled={togglingFavorite}
        >
          <Star className={cn("h-3.5 w-3.5", isFavorite && "fill-yellow-400 text-yellow-400")} />
          {isFavorite ? "Favorited" : "Favorite"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className={cn("h-7 px-2 text-xs gap-1.5", isPinned && "text-blue-500")}
          onClick={handleTogglePin}
          disabled={togglingPin}
        >
          <Pin className={cn("h-3.5 w-3.5", isPinned && "fill-blue-400 text-blue-400")} />
          {isPinned ? "Pinned" : "Pin"}
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5">
          <Copy className="h-3.5 w-3.5" />
          Copy
        </Button>
        <Button variant="ghost" size="sm" className="h-7 px-2 text-xs gap-1.5" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
          Edit
        </Button>
        <div className="flex-1" />
        <Button
          variant="ghost"
          size="icon-sm"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={() => setDeleteOpen(true)}
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>

      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent size="sm">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete item?</AlertDialogTitle>
            <AlertDialogDescription>
              &ldquo;{item.title}&rdquo; will be permanently deleted. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction variant="destructive" onClick={handleDelete} disabled={deleting}>
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

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
            <ItemContentField
              typeName={item.itemType.name}
              value={item.content}
              language={item.language}
            />
          </section>
        )}
        {item.fileUrl && item.itemType.name === "image" && (
          <section className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/files/${item.fileUrl}`}
              alt={item.fileName ?? item.title}
              loading="lazy"
              decoding="async"
              className="rounded-md max-h-64 object-contain border border-border"
            />
            {item.fileName && (
              <p className="text-xs text-muted-foreground">
                {item.fileName}{item.fileSize ? ` · ${formatBytes(item.fileSize)}` : ""}
              </p>
            )}
          </section>
        )}
        {item.fileUrl && item.itemType.name === "file" && (
          <section className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">File</p>
            <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-3 py-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <File className="h-4 w-4 shrink-0 text-muted-foreground" />
                <span className="truncate text-xs">{item.fileName ?? "File"}</span>
                {item.fileSize && (
                  <span className="text-xs text-muted-foreground shrink-0">{formatBytes(item.fileSize)}</span>
                )}
              </div>
              <a
                href={`/api/files/${item.fileUrl}`}
                download={item.fileName ?? true}
                className="ml-2 text-muted-foreground hover:text-foreground"
              >
                <Download className="h-3.5 w-3.5" />
              </a>
            </div>
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
              <span>{new Date(item.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Updated</span>
              <span>{new Date(item.updatedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
