interface RawCollection {
  items: Array<{
    item: {
      itemType: { name: string; icon: string; color: string } | null;
    };
  }>;
}

export interface CollectionIconMeta {
  iconKey: string;
  color: string;
  name: string;
}

export function buildCollectionsWithMeta<T extends RawCollection>(collections: T[]) {
  return collections.map((col) => {
    const typeCounts: Record<string, { count: number; color: string }> = {};
    const iconsMap = new Map<string, CollectionIconMeta>();

    col.items.forEach((ic) => {
      const t = ic.item.itemType;
      if (t) {
        if (!typeCounts[t.name]) typeCounts[t.name] = { count: 0, color: t.color };
        typeCounts[t.name].count++;
        if (!iconsMap.has(t.name)) {
          iconsMap.set(t.name, { iconKey: t.icon, color: t.color, name: t.name });
        }
      }
    });

    let primaryColor: string | undefined;
    if (Object.keys(typeCounts).length > 0) {
      primaryColor = Object.entries(typeCounts).sort((a, b) => b[1].count - a[1].count)[0][1].color;
    }

    return {
      ...col,
      borderColor: primaryColor,
      icons: Array.from(iconsMap.values()),
    };
  });
}
