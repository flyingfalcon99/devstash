import { prisma } from "../prisma";

export async function getFavorites(userId: string) {
  const [items, collections] = await Promise.all([
    prisma.item.findMany({
      where: { userId, isFavorite: true },
      orderBy: { updatedAt: "desc" },
      select: {
        id: true,
        title: true,
        updatedAt: true,
        itemType: { select: { name: true, icon: true, color: true } },
      },
    }),
    prisma.collection.findMany({
      where: { userId, isFavorite: true },
      orderBy: { updatedAt: "desc" },
      select: { id: true, name: true, updatedAt: true },
    }),
  ]);
  return { items, collections };
}
