"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { updateItemById, deleteItemById, createItemInDb } from "@/lib/db/items";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z.string().url({ message: "Please enter a valid URL" }).nullable().optional()
  ),
  language: z.string().nullable().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
});

export type UpdateItemInput = {
  title: string;
  description: string | null;
  content: string | null;
  url: string | null;
  language: string | null;
  tags: string[];
};

export async function updateItem(itemId: string, rawData: UpdateItemInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Unauthorized" };
  }

  const parsed = schema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  try {
    const updated = await updateItemById(itemId, session.user.id, parsed.data);
    if (!updated) {
      return { success: false as const, error: "Item not found" };
    }
    return { success: true as const, data: updated };
  } catch {
    return { success: false as const, error: "Failed to save changes" };
  }
}

const createSchema = z.object({
  type: z.enum(["snippet", "prompt", "command", "note", "link"]),
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z.string().url({ message: "Please enter a valid URL" }).nullable().optional()
  ),
  language: z.string().nullable().optional(),
  tags: z.array(z.string().trim().min(1)).default([]),
}).superRefine((data, ctx) => {
  if (data.type === "link" && !data.url) {
    ctx.addIssue({ code: "custom", path: ["url"], message: "URL is required for links" });
  }
});

export type CreateItemInput = z.infer<typeof createSchema>;

export async function createItem(rawData: CreateItemInput) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Unauthorized" };
  }

  const parsed = createSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false as const, error: parsed.error.issues[0].message };
  }

  try {
    const item = await createItemInDb(session.user.id, parsed.data);
    return { success: true as const, data: item };
  } catch {
    return { success: false as const, error: "Failed to create item" };
  }
}

export async function deleteItem(itemId: string) {
  const session = await auth();
  if (!session?.user?.id) {
    return { success: false as const, error: "Unauthorized" };
  }

  try {
    const deleted = await deleteItemById(itemId, session.user.id);
    if (!deleted) {
      return { success: false as const, error: "Item not found" };
    }
    return { success: true as const };
  } catch {
    return { success: false as const, error: "Failed to delete item" };
  }
}
