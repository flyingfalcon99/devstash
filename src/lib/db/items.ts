import { prisma } from '../prisma';

export async function getPinnedItems(userId: string) {
  return prisma.item.findMany({
    where: { 
      userId,
      isPinned: true
    },
    orderBy: { createdAt: 'desc' },
    include: {
      itemType: true
    }
  });
}

export async function getRecentItems(userId: string, limit = 10) {
  return prisma.item.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      itemType: true
    }
  });
}

export async function getSidebarItemTypes(userId: string) {
  const types = await prisma.itemType.findMany({
    where: { isSystem: true }
  });

  const itemCounts = await prisma.item.groupBy({
    by: ['itemTypeId'],
    where: { userId },
    _count: {
      id: true
    }
  });

  const countMap = itemCounts.reduce((acc, curr) => {
    acc[curr.itemTypeId] = curr._count.id;
    return acc;
  }, {} as Record<string, number>);

  const order = ['snippet', 'prompt', 'command', 'note', 'file', 'image', 'link'];

  const mapped = types.map(t => ({
    ...t,
    name: t.name.charAt(0).toUpperCase() + t.name.slice(1),
    count: countMap[t.id] || 0,
    originalName: t.name
  }));

  mapped.sort((a, b) => {
    const idxA = order.indexOf(a.originalName);
    const idxB = order.indexOf(b.originalName);
    if (idxA === -1 && idxB === -1) return a.originalName.localeCompare(b.originalName);
    if (idxA === -1) return 1;
    if (idxB === -1) return -1;
    return idxA - idxB;
  });

  return mapped;
}
