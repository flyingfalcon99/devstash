import Link from "next/link";
import { items, collections, itemTypes } from "@/lib/mock-data";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link as LinkIcon,
  Star,
  Folder,
  Pin,
  Clock
} from "lucide-react";
import { cn } from "@/lib/utils";

const iconMap = {
  Code,
  Sparkles,
  Terminal,
  StickyNote,
  File,
  Image,
  Link: LinkIcon,
} as const;

function getItemIconAndColor(itemTypeId: string) {
  const type = itemTypes.find((t) => t.id === itemTypeId);
  if (!type) return { Icon: File, color: "#6b7280" };
  const Icon = iconMap[type.icon as keyof typeof iconMap] || File;
  return { Icon, color: type.color, name: type.name };
}

export default function DashboardPage() {
  const totalItems = items.length;
  const totalCollections = collections.length;
  const favoriteItems = items.filter((item) => item.isFavorite).length;
  const favoriteCollections = collections.filter((col) => col.isFavorite).length;

  const recentCollections = [...collections]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  const pinnedItems = items.filter((item) => item.isPinned);

  const recentItems = [...items]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 10);

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
            <div className="text-2xl font-bold">{totalItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Collections</CardTitle>
            <Folder className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCollections}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Items</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoriteItems}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Favorite Collections</CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{favoriteCollections}</div>
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
          <div className="grid gap-4 grid-cols-1 md:grid-cols-3">
            {recentCollections.map((col) => (
              <Link key={col.id} href={`/collections/${col.id}`}>
                <Card className="hover:bg-muted/50 transition-colors border-border/50 shadow-sm">
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
                  </CardHeader>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        {/* Pinned Items */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold tracking-tight">Pinned Items</h2>
          </div>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {pinnedItems.map((item) => {
              const { Icon, color, name } = getItemIconAndColor(item.itemTypeId);
              return (
                <Link key={item.id} href={`/items/${item.id}`}>
                  <Card className="hover:bg-muted/50 transition-colors border-border/50 shadow-sm">
                    <CardHeader className="p-4 flex flex-row items-start justify-between space-y-0 gap-4">
                      <div className="space-y-1 overflow-hidden">
                        <div className="flex items-center gap-2">
                          <Icon className="h-4 w-4 shrink-0" style={{ color }} />
                          <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
                        </div>
                        <CardDescription className="text-xs truncate">
                          {item.description || "No description"}
                        </CardDescription>
                      </div>
                      <div className="flex flex-col items-end gap-2 shrink-0">
                        <Pin className="h-3 w-3 fill-muted-foreground text-muted-foreground" />
                        {item.language && (
                          <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                            {item.language}
                          </Badge>
                        )}
                      </div>
                    </CardHeader>
                  </Card>
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Items */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold tracking-tight">Recent Items</h2>
          <Link href="/items" className="text-sm text-muted-foreground hover:underline">
            View all
          </Link>
        </div>
        <div className="grid gap-3 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {recentItems.map((item) => {
            const { Icon, color, name } = getItemIconAndColor(item.itemTypeId);
            return (
              <Link key={item.id} href={`/items/${item.id}`}>
                <Card className="hover:bg-muted/50 transition-colors border-border/50 shadow-sm h-full flex flex-col">
                  <CardHeader className="p-4 pb-2 flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-2 max-w-[80%]">
                        <Icon className="h-4 w-4 shrink-0" style={{ color }} />
                        <CardTitle className="text-sm font-medium truncate">{item.title}</CardTitle>
                      </div>
                      {item.isFavorite && <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 shrink-0" />}
                    </div>
                    <CardDescription className="text-xs line-clamp-2">
                      {item.description || "No description"}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 pt-0 text-xs text-muted-foreground flex items-center justify-between mt-auto">
                    <div className="flex items-center gap-1.5">
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0 font-normal capitalize">
                        {name}
                      </Badge>
                      {item.language && (
                        <Badge variant="secondary" className="text-[10px] px-1.5 py-0 font-normal">
                          {item.language}
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center gap-1">
                      <Clock className="h-3 w-3" />
                      <span>
                        {new Date(item.createdAt).toLocaleDateString(undefined, {
                          month: "short",
                          day: "numeric",
                        })}
                      </span>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
