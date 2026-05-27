import { prisma } from '../prisma';

export type SearchItemData = {
  id: string;
  title: string;
  typeIcon: string;
  typeColor: string;
  typeName: string;
};

export type SearchCollectionData = {
  id: string;
  name: string;
  itemCount: number;
};

export type SearchData = {
  items: SearchItemData[];
  collections: SearchCollectionData[];
};

export async function getSearchData(userId: string): Promise<SearchData> {
  const [items, collections] = await Promise.all([
    prisma.item.findMany({
      where: { userId },
      select: {
        id: true,
        title: true,
        itemType: { select: { name: true, icon: true, color: true } },
      },
      orderBy: { createdAt: 'desc' },
    }),
    prisma.collection.findMany({
      where: { userId },
      select: {
        id: true,
        name: true,
        _count: { select: { items: true } },
      },
      orderBy: { name: 'asc' },
    }),
  ]);

  return {
    items: items.map((item) => ({
      id: item.id,
      title: item.title,
      typeIcon: item.itemType?.icon ?? 'File',
      typeColor: item.itemType?.color ?? '#6b7280',
      typeName: item.itemType?.name ?? 'unknown',
    })),
    collections: collections.map((col) => ({
      id: col.id,
      name: col.name,
      itemCount: col._count.items,
    })),
  };
}
