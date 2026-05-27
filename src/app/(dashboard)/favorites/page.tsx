import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { getFavorites } from "@/lib/db/favorites";
import { FavoritesList } from "@/components/features/favorites/favorites-list";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/sign-in");

  const { items, collections } = await getFavorites(session.user.id);

  return (
    <div className="max-w-3xl space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Favorites</h1>
        <p className="text-muted-foreground">
          {items.length + collections.length} starred{" "}
          {items.length + collections.length === 1 ? "item" : "items"}
        </p>
      </div>

      <FavoritesList items={items} collections={collections} />
    </div>
  );
}
