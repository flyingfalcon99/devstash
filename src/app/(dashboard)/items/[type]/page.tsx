import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { getItemsByType, getItemTypeBySlug } from "@/lib/db/items";
import { ItemsClientWrapper } from "@/components/features/items/items-client-wrapper";
import { NewItemButton } from "@/components/features/items/new-item-button";

const CREATABLE_TYPES = ["snippet", "prompt", "command", "note", "link"] as const;
type CreatableType = (typeof CREATABLE_TYPES)[number];

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
  const isCreatable = (CREATABLE_TYPES as readonly string[]).includes(typeSlug);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">{displayName}</h1>
          <p className="text-muted-foreground">
            {items.length} {items.length === 1 ? "item" : "items"}
          </p>
        </div>
        {isCreatable && (
          <NewItemButton
            defaultType={typeSlug as CreatableType}
            label={`Add ${typeSlug.charAt(0).toUpperCase() + typeSlug.slice(1)}`}
          />
        )}
      </div>

      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">No {displayName.toLowerCase()} yet.</p>
      ) : (
        <ItemsClientWrapper items={items} typeSlug={typeSlug} />
      )}
    </div>
  );
}
