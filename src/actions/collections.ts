"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const CreateCollectionSchema = z.object({
  name: z.string().min(1, "Name is required").max(100),
  description: z.string().max(500).optional().nullable(),
});

export type CreateCollectionInput = z.infer<typeof CreateCollectionSchema>;

export async function createCollection(rawData: CreateCollectionInput) {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Not authenticated" };

  const parsed = CreateCollectionSchema.safeParse(rawData);
  if (!parsed.success) {
    return { success: false, error: parsed.error.issues[0]?.message ?? "Invalid input" };
  }

  const { name, description } = parsed.data;

  try {
    const collection = await prisma.collection.create({
      data: {
        name,
        description: description ?? null,
        userId: session.user.id,
      },
    });
    return { success: true, id: collection.id };
  } catch (err) {
    return { success: false, error: err instanceof Error ? err.message : "Failed to create collection" };
  }
}
