"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { updateItemById } from "@/lib/db/items";

const schema = z.object({
  title: z.string().trim().min(1, "Title is required"),
  description: z.string().nullable().optional(),
  content: z.string().nullable().optional(),
  url: z.preprocess(
    (v) => (typeof v === "string" && v.trim() === "" ? null : v),
    z.string().url("Please enter a valid URL").nullable().optional()
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
