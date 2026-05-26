"use client";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DialogFooter } from "@/components/ui/dialog";
import { itemTypeIconMap } from "@/lib/constants/item-types";
import { fieldLabel, textareaClass } from "@/lib/constants/form-styles";
import { ItemContentField } from "./item-content-field";
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

export type ItemTypeSlug = (typeof ITEM_TYPES)[number]["slug"];

const CONTENT_TYPES: ItemTypeSlug[] = ["snippet", "prompt", "command", "note"];
const LANGUAGE_TYPES: ItemTypeSlug[] = ["snippet", "command"];
export const FILE_TYPES: ItemTypeSlug[] = ["file", "image"];

export interface NewItemFormState {
  type: ItemTypeSlug;
  title: string;
  description: string;
  content: string;
  language: string;
  url: string;
  tags: string;
}

interface NewItemFormProps {
  form: NewItemFormState;
  set: (field: keyof NewItemFormState, value: string) => void;
  uploaded: UploadResult | null;
  onTypeChange: (slug: string) => void;
  onUpload: (result: UploadResult) => void;
  onClear: () => void;
  onSubmit: (e: React.FormEvent) => void;
  onCancel: () => void;
  saving: boolean;
}

export function NewItemForm({
  form,
  set,
  uploaded,
  onTypeChange,
  onUpload,
  onClear,
  onSubmit,
  onCancel,
  saving,
}: NewItemFormProps) {
  const showContent = CONTENT_TYPES.includes(form.type);
  const showLanguage = LANGUAGE_TYPES.includes(form.type);
  const showUrl = form.type === "link";
  const showFile = FILE_TYPES.includes(form.type);

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Type selector */}
      <div className="flex gap-1.5 flex-wrap">
        {ITEM_TYPES.map(({ slug, iconKey, label }) => {
          const Icon = itemTypeIconMap[iconKey];
          return (
            <button
              key={slug}
              type="button"
              onClick={() => onTypeChange(slug)}
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

      {showFile && (
        <div className="space-y-1.5">
          <label className={fieldLabel}>File *</label>
          <FileUpload
            itemType={form.type as "file" | "image"}
            uploaded={uploaded}
            onUpload={onUpload}
            onClear={onClear}
          />
        </div>
      )}

      <div className="space-y-1.5">
        <label className={fieldLabel}>Title *</label>
        <Input
          value={form.title}
          onChange={(e) => set("title", e.target.value)}
          placeholder="Item title"
          required
        />
      </div>

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

      {showContent && (
        <div className="space-y-1.5">
          <label className={fieldLabel}>Content</label>
          <ItemContentField
            typeName={form.type}
            value={form.content}
            onChange={(val) => set("content", val)}
            language={form.language || null}
            maxHeight={240}
            rows={6}
          />
        </div>
      )}

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
        <Button type="button" variant="outline" size="sm" onClick={onCancel} disabled={saving}>
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
  );
}
