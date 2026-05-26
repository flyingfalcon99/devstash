"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { createItem, createFileItem, type CreateItemInput, type CreateFileItemInput } from "@/actions/items";
import { type UploadResult } from "@/components/ui/file-upload";
import { NewItemForm, FILE_TYPES, type ItemTypeSlug, type NewItemFormState } from "./new-item-form";

const defaultForm: NewItemFormState = {
  type: "snippet",
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
  const [form, setForm] = useState<NewItemFormState>({ ...defaultForm, type: defaultType ?? defaultForm.type });
  const [uploaded, setUploaded] = useState<UploadResult | null>(null);
  const [saving, setSaving] = useState(false);
  const [collections, setCollections] = useState<{ id: string; name: string }[]>([]);
  const [collectionIds, setCollectionIds] = useState<string[]>([]);

  async function openDialog() {
    setForm({ ...defaultForm, type: defaultType ?? defaultForm.type });
    setUploaded(null);
    setCollectionIds([]);
    setOpen(true);
    const res = await fetch("/api/collections");
    if (res.ok) setCollections(await res.json());
  }

  function set(field: keyof NewItemFormState, value: string) {
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
        collectionIds,
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
        collectionIds,
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
          <NewItemForm
            form={form}
            set={set}
            uploaded={uploaded}
            collections={collections}
            collectionIds={collectionIds}
            onCollectionChange={setCollectionIds}
            onTypeChange={handleTypeChange}
            onUpload={handleUpload}
            onClear={() => setUploaded(null)}
            onSubmit={handleSubmit}
            onCancel={() => setOpen(false)}
            saving={saving}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
