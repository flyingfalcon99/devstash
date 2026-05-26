import { cache } from 'react';
import { prisma } from '../prisma';

export const getDemoUser = cache(async () => {
  try {
    return await prisma.user.findFirst({
      where: { email: 'demo@devstash.io' }
    });
  } catch (err) {
    throw new Error(`Failed to fetch demo user: ${err instanceof Error ? err.message : String(err)}`);
  }
});

export async function getDashboardStats(userId: string) {
  try {
    const [totalItems, totalCollections, favoriteItems, favoriteCollections] = await Promise.all([
      prisma.item.count({ where: { userId } }),
      prisma.collection.count({ where: { userId } }),
      prisma.item.count({ where: { userId, isFavorite: true } }),
      prisma.collection.count({ where: { userId, isFavorite: true } })
    ]);

    return { totalItems, totalCollections, favoriteItems, favoriteCollections };
  } catch (err) {
    throw new Error(`Failed to fetch dashboard stats: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function getRecentCollections(userId: string, limit = 6) {
  try {
    return await prisma.collection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      take: limit,
      include: {
        items: {
          include: {
            item: {
              select: {
                itemType: {
                  select: { name: true, icon: true, color: true }
                }
              }
            }
          }
        }
      }
    });
  } catch (err) {
    throw new Error(`Failed to fetch recent collections: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function getAllCollections(userId: string) {
  try {
    return await prisma.collection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      include: {
        items: {
          include: {
            item: {
              select: {
                itemType: {
                  select: { name: true, icon: true, color: true }
                }
              }
            }
          }
        }
      }
    });
  } catch (err) {
    throw new Error(`Failed to fetch collections: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function getCollectionWithItems(id: string, userId: string) {
  try {
    return await prisma.collection.findFirst({
      where: { id, userId },
      include: {
        items: {
          include: {
            item: {
              include: { itemType: true }
            }
          },
          orderBy: { item: { createdAt: 'desc' } }
        }
      }
    });
  } catch (err) {
    throw new Error(`Failed to fetch collection: ${err instanceof Error ? err.message : String(err)}`);
  }
}

export async function getSidebarCollections(userId: string) {
  try {
    const collections = await prisma.collection.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        name: true,
        isFavorite: true,
        _count: { select: { items: true } },
        items: {
          take: 10,
          include: {
            item: {
              select: {
                itemType: {
                  select: { name: true, color: true }
                }
              }
            }
          }
        }
      }
    });

    const favorites: Array<{ id: string; name: string }> = [];
    const recents: Array<{ id: string; name: string; itemCount: number; color: string }> = [];

    for (const col of collections) {
      if (col.isFavorite) {
        favorites.push({ id: col.id, name: col.name });
      } else {
        const typeCounts: Record<string, { count: number; color: string }> = {};
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
          itemCount: col._count.items,
          color: primaryColor
        });
      }
    }

    return { favorites, recents };
  } catch (err) {
    throw new Error(`Failed to fetch sidebar collections: ${err instanceof Error ? err.message : String(err)}`);
  }
}
