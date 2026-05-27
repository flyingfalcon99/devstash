import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DashboardLayoutClient } from "@/components/layout/dashboard-layout-client";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSidebarItemTypes } from "@/lib/db/items";
import { getSearchData } from "@/lib/db/search";
import { DEFAULT_EDITOR_PREFERENCES, type EditorPreferences } from "@/lib/editor-preferences";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const { user } = session;
  const userId = user.id!;

  const [itemTypes, { favorites, recents }, searchData, userPrefs] = await Promise.all([
    getSidebarItemTypes(userId),
    getSidebarCollections(userId),
    getSearchData(userId),
    prisma.user.findUnique({ where: { id: userId }, select: { editorPreferences: true } }),
  ]);

  const editorPreferences: EditorPreferences = {
    ...DEFAULT_EDITOR_PREFERENCES,
    ...((userPrefs?.editorPreferences as Partial<EditorPreferences>) ?? {}),
  };

  const sidebarProps = {
    user: {
      name: user.name ?? "",
      email: user.email ?? "",
      image: user.image ?? null,
    },
    itemTypes,
    favoriteCollections: favorites,
    recentCollections: recents,
  };

  return (
    <DashboardLayoutClient sidebarProps={sidebarProps} searchData={searchData} editorPreferences={editorPreferences}>
      {children}
    </DashboardLayoutClient>
  );
}
