import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { DashboardLayoutClient } from "@/components/layout/dashboard-layout-client";
import { getSidebarCollections } from "@/lib/db/collections";
import { getSidebarItemTypes } from "@/lib/db/items";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session?.user) redirect("/sign-in");

  const { user } = session;
  const userId = user.id!;

  const itemTypes = await getSidebarItemTypes(userId);
  const { favorites, recents } = await getSidebarCollections(userId);

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

  return <DashboardLayoutClient sidebarProps={sidebarProps}>{children}</DashboardLayoutClient>;
}
