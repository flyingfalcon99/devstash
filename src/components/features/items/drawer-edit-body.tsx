"use client";

import { useState } from "react";
import { Check, X } from "lucide-react";
import { toast } from "sonner";
import { SheetTitle } from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { fieldLabel, textareaClass } from "@/lib/constants/form-styles";
import { updateItem, type UpdateItemInput } from "@/actions/items";
import { ItemContentField } from "./item-content-field";
import type { ItemDetail } from "./item-types";

const CONTENT_TYPES = ["snippet", "prompt", "command", "note"];
const LANGUAGE_TYPES = ["snippet", "command"];
const URL_TYPES = ["link"];

interface DrawerEditBodyProps {
  item: ItemDetail;
  onSaveSuccess: () => void;
  onCancel: () => void;
}

export function DrawerEditBody({ item, onSaveSuccess, onCancel }: DrawerEditBodyProps) {
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
      onSaveSuccess();
    } else {
      toast.error(result.error ?? "Failed to save changes");
    }
    setSaving(false);
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="px-5 pt-10 pb-3 pr-12">
        <SheetTitle className="sr-only">Edit {item.title}</SheetTitle>
        <div className="flex items-center gap-1.5">
          <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal capitalize">
            {item.itemType.name}
          </Badge>
        </div>
      </div>

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

      <div className="flex-1 overflow-y-auto px-5 py-4 space-y-4">
        <div className="space-y-1.5">
          <label className={fieldLabel}>Title</label>
          <Input
            value={form.title}
            onChange={(e) => set("title", e.target.value)}
            placeholder="Item title"
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
              typeName={typeName}
              value={form.content}
              onChange={(val) => set("content", val)}
              language={form.language || null}
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
            <label className={fieldLabel}>URL</label>
            <Input
              value={form.url}
              onChange={(e) => set("url", e.target.value)}
              placeholder="https://"
              type="url"
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
