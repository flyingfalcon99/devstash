import { prisma } from '../prisma';

export async function getDemoUser() {
  return prisma.user.findFirst({
    where: { email: 'demo@devstash.io' }
  });
}

export async function getDashboardStats(userId: string) {
  const [totalItems, totalCollections, favoriteItems, favoriteCollections] = await Promise.all([
    prisma.item.count({ where: { userId } }),
    prisma.collection.count({ where: { userId } }),
    prisma.item.count({ where: { userId, isFavorite: true } }),
    prisma.collection.count({ where: { userId, isFavorite: true } })
  ]);

  return {
    totalItems,
    totalCollections,
    favoriteItems,
    favoriteCollections
  };
}

export async function getRecentCollections(userId: string, limit = 6) {
  return prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: limit,
    include: {
      items: {
        include: {
          item: {
            include: {
              itemType: true
            }
          }
        }
      }
    }
  });
}
