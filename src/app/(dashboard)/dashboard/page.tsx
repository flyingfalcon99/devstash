import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDashboardStats, getRecentCollections } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems } from "@/lib/db/items";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { File, Star, Folder, Bookmark } from "lucide-react";
import { buildCollectionsWithMeta } from "@/lib/dashboard-utils";
import { CollectionCard } from "@/components/features/collections/collection-card";
import { DashboardItemsClient } from "@/components/features/items/dashboard-items-client";
import { DASHBOARD_COLLECTIONS_LIMIT, DASHBOARD_RECENT_ITEMS_LIMIT } from "@/lib/constants/pagination";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const userId = session.user.id;

  const [stats, dbRecentCollections, pinnedItems, recentItems] = await Promise.all([
    getDashboardStats(userId),
    getRecentCollections(userId, DASHBOARD_COLLECTIONS_LIMIT),
    getPinnedItems(userId),
    getRecentItems(userId, DASHBOARD_RECENT_ITEMS_LIMIT),
  ]);

  const collectionsWithMeta = buildCollectionsWithMeta(dbRecentCollections);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your DevNest.</p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Items</CardTitle>
            <File className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalCollections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Items</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Collections</CardTitle>
            <Bookmark className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.favoriteCollections}</div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Recent Collections */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Recent Collections</h2>
            <Link href="/collections" className="text-sm text-muted-foreground hover:underline">
              View all
            </Link>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {collectionsWithMeta.map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
        </div>

      </div>

      <DashboardItemsClient pinnedItems={pinnedItems} recentItems={recentItems} />
    </div>
  );
}
