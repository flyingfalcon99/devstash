"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const CollectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().nullable(),
});

export type CreateCollectionInput = z.infer<typeof CollectionSchema>;
export type UpdateCollectionInput = z.infer<typeof CollectionSchema>;

export async function createCollection(rawData: CreateCollectionInput) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const parsed = CollectionSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, description } = parsed.data;

  try {
    const collection = await prisma.collection.create({
      data: { name, description: description ?? null, userId: session.user.id },
    });
    return { success: true, id: collection.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create collection" };
  }
}

export async function updateCollection(id: string, rawData: UpdateCollectionInput) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const parsed = CollectionSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  try {
    const existing = await prisma.collection.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) return { success: false, error: "Collection not found" };

    await prisma.collection.update({
      where: { id },
      data: { name: parsed.data.name, description: parsed.data.description ?? null },
    });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to update collection" };
  }
}

export async function deleteCollection(id: string) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  try {
    const existing = await prisma.collection.findFirst({ where: { id, userId: session.user.id } });
    if (!existing) return { success: false, error: "Collection not found" };

    await prisma.collection.delete({ where: { id } });
    return { success: true };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to delete collection" };
  }
}
