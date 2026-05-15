import { DashboardLayoutClient } from "@/components/layout/dashboard-layout-client";
import { getDemoUser, getSidebarCollections } from "@/lib/db/collections";
import { getSidebarItemTypes } from "@/lib/db/items";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getDemoUser();
  if (!user) return null;

  const itemTypes = await getSidebarItemTypes(user.id);
  const { favorites, recents } = await getSidebarCollections(user.id);

  const sidebarProps = {
    user: { name: user.name ?? "", email: user.email },
    itemTypes,
    favoriteCollections: favorites,
    recentCollections: recents
  };

  return <DashboardLayoutClient sidebarProps={sidebarProps}>{children}</DashboardLayoutClient>;
}
