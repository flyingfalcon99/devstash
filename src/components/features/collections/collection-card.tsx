"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Folder, Star, MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { itemTypeIconMap } from "@/lib/constants/item-types";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
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
import { fieldLabel, textareaClass } from "@/lib/constants/form-styles";
import { updateCollection, deleteCollection } from "@/actions/collections";

export interface CollectionCardData {
  id: string;
  name: string;
  description: string | null;
  isFavorite: boolean;
  borderColor?: string;
  icons: { iconKey: string; color: string; name: string }[];
}

interface CollectionCardProps {
  collection: CollectionCardData;
  onDeleted?: () => void;
}

export function CollectionCard({ collection, onDeleted }: CollectionCardProps) {
  const router = useRouter();
  const [editOpen, setEditOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [name, setName] = useState(collection.name);
  const [description, setDescription] = useState(collection.description ?? "");
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  function openEdit(e: React.MouseEvent) {
    e.stopPropagation();
    setName(collection.name);
    setDescription(collection.description ?? "");
    setEditOpen(true);
  }

  function openDelete(e: React.MouseEvent) {
    e.stopPropagation();
    setDeleteOpen(true);
  }

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    const result = await updateCollection(collection.id, {
      name,
      description: description || null,
    });
    if (result.success) {
      toast.success("Collection updated");
      router.refresh();
      setEditOpen(false);
    } else {
      toast.error(result.error ?? "Failed to update collection");
    }
    setSaving(false);
  }

  async function handleDelete() {
    setDeleting(true);
    const result = await deleteCollection(collection.id);
    if (result.success) {
      toast.success("Collection deleted");
      if (onDeleted) {
        onDeleted();
      } else {
        router.refresh();
      }
    } else {
      toast.error(result.error ?? "Failed to delete collection");
    }
    setDeleting(false);
    setDeleteOpen(false);
  }

  return (
    <>
      <Card
        onClick={() => router.push(`/collections/${collection.id}`)}
        className="hover:bg-muted/50 transition-colors shadow-sm h-full cursor-pointer relative group"
        style={{
          borderLeftColor: collection.borderColor || undefined,
          borderLeftWidth: collection.borderColor ? "3px" : "1px",
        }}
      >
        <CardHeader className="p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 min-w-0">
              <Folder className="h-4 w-4 text-primary shrink-0" />
              <CardTitle className="text-sm font-medium truncate">{collection.name}</CardTitle>
            </div>
            <div className="flex items-center gap-1 shrink-0">
              {collection.isFavorite && (
                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              )}
              <DropdownMenu>
                <DropdownMenuTrigger
                  className="inline-flex h-6 w-6 items-center justify-center rounded-md text-muted-foreground opacity-0 transition-opacity hover:bg-accent hover:text-foreground group-hover:opacity-100 focus-visible:opacity-100"
                  onClick={(e) => e.stopPropagation()}
                >
                  <MoreHorizontal className="h-3.5 w-3.5" />
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
                  <DropdownMenuItem onClick={openEdit}>
                    <Pencil className="h-3.5 w-3.5 mr-2" />
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem disabled>
                    <Star className="h-3.5 w-3.5 mr-2" />
                    Favorite
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem variant="destructive" onClick={openDelete}>
                    <Trash2 className="h-3.5 w-3.5 mr-2" />
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          {collection.description && (
            <CardDescription className="text-xs mt-1 truncate">
              {collection.description}
            </CardDescription>
          )}
          {collection.icons.length > 0 && (
            <div className="flex items-center gap-1.5 mt-3">
              {collection.icons.map((iconData, idx) => {
                const Icon = itemTypeIconMap[iconData.iconKey as keyof typeof itemTypeIconMap];
                return Icon ? (
                  <span key={idx} title={iconData.name}>
                    <Icon className="h-3.5 w-3.5" style={{ color: iconData.color }} />
                  </span>
                ) : null;
              })}
            </div>
          )}
        </CardHeader>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={editOpen} onOpenChange={(o) => { if (!saving) setEditOpen(o); }}>
        <DialogContent className="sm:max-w-md" onClick={(e) => e.stopPropagation()}>
          <DialogHeader>
            <DialogTitle>Edit Collection</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="space-y-1.5">
              <label className={fieldLabel}>Name *</label>
              <Input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. React Patterns"
                required
              />
            </div>
            <div className="space-y-1.5">
              <label className={fieldLabel}>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="What's this collection for?"
                rows={3}
                className={textareaClass}
              />
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setEditOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button type="submit" size="sm" disabled={saving || !name.trim()}>
                {saving ? "Saving…" : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <AlertDialogContent onClick={(e) => e.stopPropagation()}>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete collection?</AlertDialogTitle>
            <AlertDialogDescription>
              <strong>&ldquo;{collection.name}&rdquo;</strong> will be permanently deleted. Items inside it will not be deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? "Deleting…" : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}
