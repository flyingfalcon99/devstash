import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getItemsByType, getItemTypeBySlug } from "@/lib/db/items";
import { ItemCard } from "@/components/features/items/item-card";

export default async function ItemsTypePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { type } = await params;
  const typeSlug = type.replace(/s$/, "");

  const itemType = await getItemTypeBySlug(typeSlug);
  if (!itemType) notFound();

  const items = await getItemsByType(session.user.id, typeSlug);
  const displayName = type.charAt(0).toUpperCase() + type.slice(1);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
        <p className="text-muted-foreground">
          {items.length} {items.length === 1 ? "item" : "items"}
        </p>
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {displayName.toLowerCase()} yet.</p>
      ) : (
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ItemCard key={item.id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
