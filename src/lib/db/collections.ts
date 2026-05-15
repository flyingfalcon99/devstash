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

export async function getSidebarCollections(userId: string) {
  const collections = await prisma.collection.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
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

  const favorites: Array<{ id: string, name: string }> = [];
  const recents: Array<{ id: string, name: string, itemCount: number, color: string }> = [];

  for (const col of collections) {
    if (col.isFavorite) {
      favorites.push({ id: col.id, name: col.name });
    } else {
      const typeCounts: Record<string, { count: number, color: string }> = {};
      col.items.forEach(ic => {
        const t = ic.item.itemType;
        if (t) {
          if (!typeCounts[t.name]) typeCounts[t.name] = { count: 0, color: t.color };
          typeCounts[t.name].count++;
        }
      });
      
      let primaryColor = "#6b7280";
      if (Object.keys(typeCounts).length > 0) {
        const mostUsed = Object.entries(typeCounts).sort((a, b) => b[1].count - a[1].count)[0];
        primaryColor = mostUsed[1].color;
      }

      recents.push({
        id: col.id,
        name: col.name,
        itemCount: col.items.length,
        color: primaryColor
      });
    }
  }

  return { favorites, recents };
}
