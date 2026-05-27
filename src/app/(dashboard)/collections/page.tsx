import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getCollectionsPaginated } from "@/lib/db/collections";
import { buildCollectionsWithMeta } from "@/lib/dashboard-utils";
import { CollectionCard } from "@/components/features/collections/collection-card";
import { PaginationControls } from "@/components/ui/pagination";
import { COLLECTIONS_PER_PAGE } from "@/lib/constants/pagination";

export default async function CollectionsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { page: pageParam } = await searchParams;
  const page = Math.max(1, parseInt(pageParam ?? "1", 10) || 1);

  const { collections: raw, total } = await getCollectionsPaginated(
    session.user.id,
    page,
    COLLECTIONS_PER_PAGE
  );
  const collections = buildCollectionsWithMeta(raw);
  const totalPages = Math.max(1, Math.ceil(total / COLLECTIONS_PER_PAGE));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Collections</h1>
        <p className="text-muted-foreground">
          {total} {total === 1 ? "collection" : "collections"}
        </p>
      </div>

      {total === 0 ? (
        <p className="text-sm text-muted-foreground">No collections yet.</p>
      ) : (
        <>
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {collections.map((col) => (
              <CollectionCard key={col.id} collection={col} />
            ))}
          </div>
          <PaginationControls page={page} totalPages={totalPages} />
        </>
      )}
    </div>
  );
}
