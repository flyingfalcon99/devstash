import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardLayoutClient } from "@/components/layout/dashboard-layout-client";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSidebarItemTypes } from "@/lib/db/items";
import { getSearchData } from "@/lib/db/search";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const { user } = session;
  const userId = user.id!;

  const [itemTypes, { favorites, recents }, searchData] = await Promise.all([
    getSidebarItemTypes(userId),
    getSidebarCollections(userId),
    getSearchData(userId),
  ]);

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
    <DashboardLayoutClient sidebarProps={sidebarProps} searchData={searchData}>
      {children}
    </DashboardLayoutClient>
  );
}
