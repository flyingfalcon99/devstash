import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCollectionWithItems } from "@/lib/db/collections";
import { ItemsClientWrapper } from "@/components/features/items/items-client-wrapper";
import { Folder, Star } from "lucide-react";

export default async function CollectionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { id } = await params;
  const collection = await getCollectionWithItems(id, session.user.id);
  if (!collection) notFound();

  const items = collection.items.map(({ item }) => item);

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Folder className="h-5 w-5 text-primary shrink-0" />
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{collection.name}</h1>
            {collection.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />}
          </div>
          {collection.description && (
            <p className="text-muted-foreground text-sm">{collection.description}</p>
          )}
        </div>
      </div>

      <p className="text-sm text-muted-foreground">
        {items.length} {items.length === 1 ? "item" : "items"}
      </p>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No items in this collection yet.</p>
      ) : (
        <ItemsClientWrapper items={items} />
      )}
    </div>
  );
}
