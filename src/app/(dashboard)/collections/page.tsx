import Link from "next/link";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAllCollections } from "@/lib/db/collections";
import { buildCollectionsWithMeta } from "@/lib/dashboard-utils";
import { Card, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Folder, Star } from "lucide-react";

export default async function CollectionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const raw = await getAllCollections(session.user.id);
  const collections = buildCollectionsWithMeta(raw);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
        <p className="text-muted-foreground">{collections.length} {collections.length === 1 ? "collection" : "collections"}</p>
      </div>

      {collections.length === 0 ? (
        <p className="text-sm text-muted-foreground">No collections yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <Link key={col.id} href={`/collections/${col.id}`}>
              <Card
                className="hover:bg-muted/50 transition-colors shadow-sm h-full"
                style={{ borderLeftColor: col.borderColor || undefined, borderLeftWidth: col.borderColor ? "3px" : "1px" }}
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
                    <CardDescription className="text-xs mt-1 truncate">{col.description}</CardDescription>
                  )}
                  {col.icons.length > 0 && (
                    <div className="flex items-center gap-1.5 mt-3">
                      {col.icons.map((iconData, idx) => (
                        <span key={idx} title={iconData.name}>
                          <iconData.Icon className="h-3.5 w-3.5" style={{ color: iconData.color }} />
                        </span>
                      ))}
                    </div>
                  )}
                </CardHeader>
              </Card>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
