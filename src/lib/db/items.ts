import { prisma } from '../prisma';

export async function getPinnedItems(userId: string) {
  try {
    return await prisma.item.findMany({
      where: { userId, isPinned: true },
      orderBy: { createdAt: 'desc' },
      include: { itemType: true }
    });
  } catch (err) {
    throw new Error(`Failed to fetch pinned items: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function getRecentItems(userId: string, limit = 10) {
  try {
    return await prisma.item.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: { itemType: true }
    });
  } catch (err) {
    throw new Error(`Failed to fetch recent items: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function getItemTypeBySlug(slug: string) {
  try {
    return await prisma.itemType.findFirst({
      where: { name: slug, isSystem: true }
    });
  } catch (err) {
    throw new Error(`Failed to fetch item type: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function getItemsByType(userId: string, typeSlug: string) {
  try {
    return await prisma.item.findMany({
      where: { userId, itemType: { name: typeSlug } },
      orderBy: { createdAt: 'desc' },
      include: { itemType: true }
    });
  } catch (err) {
    throw new Error(`Failed to fetch items by type: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function getSidebarItemTypes(userId: string) {
  try {
    const types = await prisma.itemType.findMany({
      where: { isSystem: true }
    });

    const itemCounts = await prisma.item.groupBy({
      by: ['itemTypeId'],
      where: { userId },
      _count: { id: true }
    });

    const countMap = itemCounts.reduce((acc, curr) => {
      acc[curr.itemTypeId] = curr._count.id;
      return acc;
    }, {} as Record<string, number>);

    const order = ['snippet', 'prompt', 'command', 'note', 'file', 'image', 'link'];

    const mapped = types.map(t => ({
      ...t,
      slug: t.name,
      name: t.name.charAt(0).toUpperCase() + t.name.slice(1),
      count: countMap[t.id] || 0,
    }));

    mapped.sort((a, b) => {
      const idxA = order.indexOf(a.slug);
      const idxB = order.indexOf(b.slug);
      if (idxA === -1 && idxB === -1) return a.slug.localeCompare(b.slug);
      if (idxA === -1) return 1;
      if (idxB === -1) return -1;
      return idxA - idxB;
    });

    return mapped;
  } catch (err) {
    throw new Error(`Failed to fetch sidebar item types: ${err instanceof Error ? err.message : String(err)}`);
  }
}
