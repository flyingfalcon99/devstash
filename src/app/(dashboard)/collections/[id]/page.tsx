import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCollectionById, getCollectionItemsPaginated } from "@/lib/db/collections";
import { CollectionItemsDisplay } from "@/components/features/items/collection-items-display";
import { CollectionDetailActions } from "@/components/features/collections/collection-detail-actions";
import { PaginationControls } from "@/components/ui/pagination";
import { ITEMS_PER_PAGE } from "@/lib/constants/pagination";
import { Folder, Star } from "lucide-react";

export default async function CollectionDetailPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const [{ id }, { page: pageParam }] = await Promise.all([params, searchParams]);

  const collection = await getCollectionById(id, session.user.id);
  if (!collection) notFound();

  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);
  const { items, total } = await getCollectionItemsPaginated(id, page, ITEMS_PER_PAGE);
  const totalPages = Math.max(1, Math.ceil(total / ITEMS_PER_PAGE));

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-2 min-w-0">
          <Folder className="h-5 w-5 text-primary shrink-0" />
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-bold tracking-tight truncate">{collection.name}</h1>
              {collection.isFavorite && <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 shrink-0" />}
            </div>
            {collection.description && (
              <p className="text-muted-foreground text-sm">{collection.description}</p>
            )}
          </div>
        </div>
        <CollectionDetailActions
          id={collection.id}
          name={collection.name}
          description={collection.description}
          isFavorite={collection.isFavorite}
        />
      </div>

      <p className="text-sm text-muted-foreground">
        {total} {total === 1 ? "item" : "items"}
      </p>

      {total === 0 ? (
        <p className="text-sm text-muted-foreground">No items in this collection yet.</p>
      ) : (
        <>
          <CollectionItemsDisplay items={items} />
          <PaginationControls page={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
