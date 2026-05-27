import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getAllCollections } from "@/lib/db/collections";
import { buildCollectionsWithMeta } from "@/lib/dashboard-utils";
import { CollectionCard } from "@/components/features/collections/collection-card";

export default async function CollectionsPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const raw = await getAllCollections(session.user.id);
  const collections = buildCollectionsWithMeta(raw);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
        <p className="text-muted-foreground">
          {collections.length} {collections.length === 1 ? "collection" : "collections"}
        </p>
      </div>

      {collections.length === 0 ? (
        <p className="text-sm text-muted-foreground">No collections yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {collections.map((col) => (
            <CollectionCard key={col.id} collection={col} />
          ))}
        </div>
      )}
    </div>
  );
}
