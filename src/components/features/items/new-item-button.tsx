"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { itemTypeIconMap } from "@/lib/constants/item-types";
import { cn } from "@/lib/utils";
import { createItem, createFileItem, type CreateItemInput, type CreateFileItemInput } from "@/actions/items";
import { CodeEditor } from "@/components/ui/code-editor";
import { MarkdownEditor } from "@/components/ui/markdown-editor";
import { FileUpload, type UploadResult } from "@/components/ui/file-upload";

const ITEM_TYPES = [
  { slug: "snippet", iconKey: "Code" as const, label: "Snippet" },
  { slug: "prompt", iconKey: "Sparkles" as const, label: "Prompt" },
  { slug: "command", iconKey: "Terminal" as const, label: "Command" },
  { slug: "note", iconKey: "StickyNote" as const, label: "Note" },
  { slug: "link", iconKey: "Link" as const, label: "Link" },
  { slug: "file", iconKey: "File" as const, label: "File" },
  { slug: "image", iconKey: "Image" as const, label: "Image" },
] as const;

type ItemTypeSlug = (typeof ITEM_TYPES)[number]["slug"];

const CONTENT_TYPES: ItemTypeSlug[] = ["snippet", "prompt", "command", "note"];
const LANGUAGE_TYPES: ItemTypeSlug[] = ["snippet", "command"];
const FILE_TYPES: ItemTypeSlug[] = ["file", "image"];

const fieldLabel = "text-xs font-medium text-muted-foreground uppercase tracking-wider";
const textareaClass =
  "w-full rounded-lg border border-input bg-transparent px-2.5 py-2 text-sm transition-colors outline-none resize-none placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50 dark:bg-input/30";

const defaultForm = {
  type: "snippet" as ItemTypeSlug,
  title: "",
  description: "",
  content: "",
  language: "",
  url: "",
  tags: "",
};

interface NewItemButtonProps {
  defaultType?: ItemTypeSlug;
  label?: string;
}

export function NewItemButton({ defaultType, label }: NewItemButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ ...defaultForm, type: defaultType ?? defaultForm.type });
  const [uploaded, setUploaded] = useState<UploadResult | null>(null);
  const [saving, setSaving] = useState(false);

  function openDialog() {
    setForm({ ...defaultForm, type: defaultType ?? defaultForm.type });
    setUploaded(null);
    setOpen(true);
  }

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
  }

  function handleTypeChange(slug: string) {
    set("type", slug);
    setUploaded(null);
  }

  function handleUpload(result: UploadResult) {
    setUploaded(result);
    if (!form.title) set("title", result.fileName.replace(/\.[^.]+$/, ""));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);

    const tags = form.tags.split(",").map((t) => t.trim()).filter(Boolean);
    const isFileType = FILE_TYPES.includes(form.type);

    let result;
    if (isFileType) {
      if (!uploaded) {
        toast.error("Please upload a file first");
        setSaving(false);
        return;
      }
      const payload: CreateFileItemInput = {
        type: form.type as "file" | "image",
        title: form.title,
        description: form.description || null,
        fileUrl: uploaded.key,
        fileName: uploaded.fileName,
        fileSize: uploaded.fileSize,
        tags,
      };
      result = await createFileItem(payload);
    } else {
      const payload: CreateItemInput = {
        type: form.type as CreateItemInput["type"],
        title: form.title,
        description: form.description || null,
        content: form.content || null,
        url: form.url || null,
        language: form.language || null,
        tags,
      };
      result = await createItem(payload);
    }

    if (result.success) {
      toast.success("Item created");
      router.refresh();
      setOpen(false);
    } else {
      toast.error(result.error ?? "Failed to create item");
    }
    setSaving(false);
  }

  const showContent = CONTENT_TYPES.includes(form.type);
  const showLanguage = LANGUAGE_TYPES.includes(form.type);
  const showUrl = form.type === "link";
  const showFile = FILE_TYPES.includes(form.type);

  return (
    <>
      <Button size="sm" className="gap-2" onClick={openDialog}>
        <Plus className="h-4 w-4" />
        {label ?? "New Item"}
      </Button>

      <Dialog open={open} onOpenChange={(o) => { if (!saving) setOpen(o); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>New Item</DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Type selector */}
            <div className="flex gap-1.5 flex-wrap">
              {ITEM_TYPES.map(({ slug, iconKey, label }) => {
                const Icon = itemTypeIconMap[iconKey];
                return (
                  <button
                    key={slug}
                    type="button"
                    onClick={() => handleTypeChange(slug)}
                    className={cn(
                      "flex items-center gap-1.5 px-2.5 py-1.5 rounded-md text-xs border transition-colors",
                      form.type === slug
                        ? "border-ring bg-muted text-foreground"
                        : "border-border text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    )}
                  >
                    {Icon && <Icon className="h-3.5 w-3.5" />}
                    {label}
                  </button>
                );
              })}
            </div>

            {/* File upload (file / image) */}
            {showFile && (
              <div className="space-y-1.5">
                <label className={fieldLabel}>File *</label>
                <FileUpload
                  itemType={form.type as "file" | "image"}
                  uploaded={uploaded}
                  onUpload={handleUpload}
                  onClear={() => setUploaded(null)}
                />
              </div>
            )}

            {/* Title */}
            <div className="space-y-1.5">
              <label className={fieldLabel}>Title *</label>
              <Input
                value={form.title}
                onChange={(e) => set("title", e.target.value)}
                placeholder="Item title"
                required
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

            {/* Content */}
            {showContent && (
              <div className="space-y-1.5">
                <label className={fieldLabel}>Content</label>
                {showLanguage ? (
                  <CodeEditor
                    value={form.content}
                    onChange={(val) => set("content", val)}
                    language={form.language || null}
                    maxHeight={240}
                  />
                ) : ["note", "prompt"].includes(form.type) ? (
                  <MarkdownEditor
                    value={form.content}
                    onChange={(val) => set("content", val)}
                    maxHeight={240}
                  />
                ) : (
                  <textarea
                    value={form.content}
                    onChange={(e) => set("content", e.target.value)}
                    placeholder="Paste your content here"
                    rows={6}
                    className={cn(textareaClass, "font-mono text-xs")}
                  />
                )}
              </div>
            )}

            {/* Language */}
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

            {/* URL */}
            {showUrl && (
              <div className="space-y-1.5">
                <label className={fieldLabel}>URL *</label>
                <Input
                  value={form.url}
                  onChange={(e) => set("url", e.target.value)}
                  placeholder="https://"
                  type="url"
                  required
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

            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setOpen(false)}
                disabled={saving}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={
                  saving ||
                  !form.title.trim() ||
                  (showUrl && !form.url.trim()) ||
                  (showFile && !uploaded)
                }
              >
                {saving ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
