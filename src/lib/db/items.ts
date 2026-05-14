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
