"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Star, Pin, Copy, Pencil, Trash2, File, Check, X, Download } from "lucide-react";
import { toast } from "sonner";
import { Sheet, SheetContent, SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { itemTypeIconMap } from "@/lib/constants/item-types";
import { cn } from "@/lib/utils";
import { updateItem, deleteItem, type UpdateItemInput } from "@/actions/items";
import { CodeEditor } from "@/components/ui/code-editor";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
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

interface ItemDetail {
  id: string;
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  fileUrl: string | null;
  fileName: string | null;
  fileSize: number | null;
  language: string | null;
  isFavorite: boolean;
  isPinned: boolean;
  createdAt: string;
  updatedAt: string;
  itemType: { name: string; icon: string; color: string };
  tags: { id: string; name: string }[];
  collections: { collection: { id: string; name: string } }[];
}

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

interface ItemDrawerProps {
  itemId: string | null;
  onClose: () => void;
}

export function ItemDrawer({ itemId, onClose }: ItemDrawerProps) {
  const [item, setItem] = useState<ItemDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<"view" | "edit">("view");

  async function fetchItem(id: string) {
    setLoading(true);
    const res = await fetch(`/api/items/${id}`);
    const data = res.ok ? await res.json() : null;
    if (data) setItem(data);
    setLoading(false);
  }

  useEffect(() => {
    if (!itemId) return;
    setMode("view");
    fetchItem(itemId);
  }, [itemId]);

  function handleSaveSuccess() {
    setMode("view");
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
          <DrawerBody item={item} onEdit={() => setMode("edit")} onClose={onClose} />
        )}
      </SheetContent>
    </Sheet>
  );
}

// ─── Skeleton ────────────────────────────────────────────────────────────────

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

// ─── View mode ───────────────────────────────────────────────────────────────

function DrawerBody({ item, onEdit, onClose }: { item: ItemDetail; onEdit: () => void; onClose: () => void }) {
  const router = useRouter();
  const Icon = itemTypeIconMap[item.itemType.icon as keyof typeof itemTypeIconMap] || File;
  const color = item.itemType.color;
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

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
            {["snippet", "command"].includes(item.itemType.name) ? (
              <CodeEditor
                value={item.content}
                language={item.language}
                readOnly
              />
            ) : ["note", "prompt"].includes(item.itemType.name) ? (
              <MarkdownEditor
                value={item.content}
                readOnly
              />
            ) : (
              <pre className="text-xs bg-muted rounded-md p-3 overflow-x-auto whitespace-pre-wrap break-words font-mono">
                {item.content}
              </pre>
            )}
          </section>
        )}
        {item.fileUrl && item.itemType.name === "image" && (
          <section className="space-y-1.5">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">Preview</p>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={`/api/files/${item.fileUrl}`}
              alt={item.fileName ?? item.title}
              className="rounded-md max-h-64 object-contain border border-border"
            />
            {item.fileName && (
              <p className="text-xs text-muted-foreground">{item.fileName}{item.fileSize ? ` · ${formatBytes(item.fileSize)}` : ""}</p>
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
                {item.fileSize && <span className="text-xs text-muted-foreground shrink-0">{formatBytes(item.fileSize)}</span>}
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
            <a href={item.url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline break-all text-xs">
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

// ─── Edit mode ────────────────────────────────────────────────────────────────

const CONTENT_TYPES = ["snippet", "prompt", "command", "note"];
const LANGUAGE_TYPES = ["snippet", "command"];
const URL_TYPES = ["link"];

const fieldLabel = "text-xs font-medium text-muted-foreground uppercase tracking-wider";
const textareaClass =
  "w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 disabled:opacity-50 dark:bg-input/30";

function DrawerEditBody({
  item,
  onSaveSuccess,
  onCancel,
}: {
  item: ItemDetail;
  onSaveSuccess: () => void;
  onCancel: () => void;
}) {
  const router = useRouter();
  const [form, setForm] = useState({
    title: item.title,
    description: item.description ?? "",
    content: item.content ?? "",
    url: item.url ?? "",
    language: item.language ?? "",
    tags: item.tags.map((t) => t.name).join(", "),
  });
  const [saving, setSaving] = useState(false);

  const typeName = item.itemType.name;
  const showContent = CONTENT_TYPES.includes(typeName);
  const showLanguage = LANGUAGE_TYPES.includes(typeName);
  const showUrl = URL_TYPES.includes(typeName);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  async function handleSave() {
    setSaving(true);
    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const payload: UpdateItemInput = {
      title: form.title,
      description: form.description || null,
      content: form.content || null,
      url: form.url || null,
      language: form.language || null,
      tags,
    };

    const result = await updateItem(item.id, payload);
    if (result.success) {
      toast.success("Changes saved");
      router.refresh();
      onSaveSuccess();
    } else {
      toast.error(result.error ?? "Failed to save changes");
    }
    setSaving(false);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Header — type info stays non-editable */}
      <div className="px-5 pt-10 pb-3 pr-12">
        <SheetTitle className="sr-only">Edit {item.title}</SheetTitle>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal capitalize">
            {item.itemType.name}
          </Badge>
        </div>
      </div>

      {/* Edit action bar */}
      <div className="flex items-center gap-2 px-4 py-2 border-y border-border">
        <Button
          size="sm"
          className="h-7 px-3 text-xs gap-1.5"
          onClick={handleSave}
          disabled={saving || !form.title.trim()}
        >
          <Check className="h-3.5 w-3.5" />
          {saving ? "Saving…" : "Save"}
        </Button>
        <Button
          variant="ghost"
          size="sm"
          className="h-7 px-3 text-xs gap-1.5"
          onClick={onCancel}
          disabled={saving}
        >
          <X className="h-3.5 w-3.5" />
          Cancel
        </Button>
      </div>

      {/* Scrollable form */}
      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        {/* Title */}
        <div className="space-y-1.5">
          <label className={fieldLabel}>Title</label>
          <Input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Item title"
          />
        </div>

        {/* Description */}
        <div className="space-y-1.5">
          <label className={fieldLabel}>Description</label>
          <textarea
            value={form.description}
            onChange={(e) => set("description", e.target.value)}
            placeholder="Short description"
            rows={2}
            className={textareaClass}
          />
        </div>

        {/* Content (snippet / prompt / command / note) */}
        {showContent && (
          <div className="space-y-1.5">
            <label className={fieldLabel}>Content</label>
            {showLanguage ? (
              <CodeEditor
                value={form.content}
                onChange={(val) => set("content", val)}
                language={form.language || null}
              />
            ) : ["note", "prompt"].includes(typeName) ? (
              <MarkdownEditor
                value={form.content}
                onChange={(val) => set("content", val)}
              />
            ) : (
              <textarea
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                placeholder="Paste your content here"
                rows={8}
                className={cn(textareaClass, "font-mono text-xs")}
              />
            )}
          </div>
        )}

        {/* Language (snippet / command) */}
        {showLanguage && (
          <div className="space-y-1.5">
            <label className={fieldLabel}>Language</label>
            <Input
              value={form.language}
              onChange={(e) => set("language", e.target.value)}
              placeholder="e.g. TypeScript"
            />
          </div>
        )}

        {/* URL (link) */}
        {showUrl && (
          <div className="space-y-1.5">
            <label className={fieldLabel}>URL</label>
            <Input
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://"
              type="url"
            />
          </div>
        )}

        {/* Tags */}
        <div className="space-y-1.5">
          <label className={fieldLabel}>Tags</label>
          <Input
            value={form.tags}
            onChange={(e) => set("tags", e.target.value)}
            placeholder="react, auth, hooks"
          />
          <p className="text-xs text-muted-foreground">Comma-separated</p>
        </div>

        {/* Non-editable: collections & dates */}
        {item.collections.length > 0 && (
          <div className="space-y-1.5">
            <p className={fieldLabel}>Collections</p>
            <div className="flex flex-wrap gap-1.5">
              {item.collections.map(({ collection }) => (
                <Badge key={collection.id} variant="outline" className="text-[10px] px-1.5 py-0 font-normal">
                  {collection.name}
                </Badge>
              ))}
            </div>
          </div>
        )}

        <div className="space-y-1 text-xs text-muted-foreground pt-1 border-t border-border">
          <div className="flex items-center justify-between pt-2">
            <span>Created</span>
            <span>{new Date(item.createdAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
          <div className="flex items-center justify-between">
            <span>Updated</span>
            <span>{new Date(item.updatedAt).toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" })}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
