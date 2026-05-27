"use server";

import { z } from "zod";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import type { EditorPreferences } from "@/lib/editor-preferences";

const schema = z.object({
  fontSize: z.number().int().min(8).max(32),
  tabSize: z.number().int().min(1).max(8),
  wordWrap: z.boolean(),
  minimap: z.boolean(),
  theme: z.enum(["vs-dark", "monokai", "github-dark"]),
});

export async function updateEditorPreferences(
  prefs: EditorPreferences
): Promise<{ success: true; prefs: EditorPreferences } | { success: false; error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { success: false, error: "Unauthorized" };

  const parsed = schema.safeParse(prefs);
  if (!parsed.success) return { success: false, error: "Invalid preferences" };

  await prisma.user.update({
    where: { id: session.user.id },
    data: { editorPreferences: parsed.data },
  });

  return { success: true, prefs: parsed.data };
}
