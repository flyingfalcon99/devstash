import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getDashboardStats, getRecentCollections } from "@/lib/db/collections";
import { getPinnedItems, getRecentItems } from "@/lib/db/items";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  File,
  Star,
  Folder,
} from "lucide-react";
import { buildCollectionsWithMeta } from "@/lib/dashboard-utils";
import { DashboardItemsClient } from "@/components/features/items/dashboard-items-client";

export default async function DashboardPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");
  const userId = session.user.id;

  const [stats, dbRecentCollections, pinnedItems, recentItems] = await Promise.all([
    getDashboardStats(userId),
    getRecentCollections(userId, 6),
    getPinnedItems(userId),
    getRecentItems(userId, 10),
  ]);

  const collectionsWithMeta = buildCollectionsWithMeta(dbRecentCollections);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Dashboard</h1>
        <p className="text-muted-foreground">Welcome back! Here's an overview of your DevStash.</p>
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
            <Star className="h-4 w-4 text-muted-foreground" />
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
              <Link key={col.id} href={`/collections/${col.id}`}>
                <Card 
                  className="hover:bg-muted/50 transition-colors shadow-sm h-full"
                  style={{ borderLeftColor: col.borderColor || undefined, borderLeftWidth: col.borderColor ? '3px' : '1px' }}
                >
                  <CardHeader className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Folder className="h-4 w-4 text-primary" />
                        <CardTitle className="text-sm font-medium">{col.name}</CardTitle>
                      </div>
                      {col.isFavorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />}
                    </div>
                    {col.description && (
                      <CardDescription className="text-xs mt-1 truncate">
                        {col.description}
                      </CardDescription>
                    )}
                    {col.icons.length > 0 && (
                      <div className="flex items-center gap-1.5 mt-3">
                        {col.icons.map((iconData, idx) => (
                          <span key={idx} title={iconData.name}>
                            <iconData.Icon
                              className="h-3.5 w-3.5"
                              style={{ color: iconData.color }}
                            />
                          </span>
                        ))}
                      </div>
                    )}
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

      </div>

      <DashboardItemsClient pinnedItems={pinnedItems} recentItems={recentItems} />
    </div>
  );
}
