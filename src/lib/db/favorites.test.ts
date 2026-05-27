import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    item: { findMany: vi.fn() },
    collection: { findMany: vi.fn() },
  },
}));

import { getFavorites } from "./favorites";
import { prisma } from "@/lib/prisma";

const mockItemFindMany = vi.mocked(prisma.item.findMany);
const mockCollectionFindMany = vi.mocked(prisma.collection.findMany);

beforeEach(() => vi.clearAllMocks());

describe("getFavorites", () => {
  it("returns favorited items and collections", async () => {
    const now = new Date();
    mockItemFindMany.mockResolvedValue([
      { id: "item-1", title: "useDebounce", updatedAt: now, itemType: { name: "snippet", icon: "Code", color: "#3b82f6" } },
    ] as never);
    mockCollectionFindMany.mockResolvedValue([
      { id: "col-1", name: "React Patterns", updatedAt: now },
    ] as never);

    const result = await getFavorites("user-1");

    expect(result.items).toHaveLength(1);
    expect(result.items[0].id).toBe("item-1");
    expect(result.collections).toHaveLength(1);
    expect(result.collections[0].id).toBe("col-1");
  });

  it("returns empty arrays when user has no favorites", async () => {
    mockItemFindMany.mockResolvedValue([] as never);
    mockCollectionFindMany.mockResolvedValue([] as never);

    const result = await getFavorites("user-1");

    expect(result.items).toEqual([]);
    expect(result.collections).toEqual([]);
  });

  it("queries items with isFavorite: true scoped to user", async () => {
    mockItemFindMany.mockResolvedValue([] as never);
    mockCollectionFindMany.mockResolvedValue([] as never);

    await getFavorites("user-42");

    expect(mockItemFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-42", isFavorite: true },
      })
    );
  });

  it("queries collections with isFavorite: true scoped to user", async () => {
    mockItemFindMany.mockResolvedValue([] as never);
    mockCollectionFindMany.mockResolvedValue([] as never);

    await getFavorites("user-42");

    expect(mockCollectionFindMany).toHaveBeenCalledWith(
      expect.objectContaining({
        where: { userId: "user-42", isFavorite: true },
      })
    );
  });

  it("orders items by updatedAt descending", async () => {
    mockItemFindMany.mockResolvedValue([] as never);
    mockCollectionFindMany.mockResolvedValue([] as never);

    await getFavorites("user-1");

    expect(mockItemFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { updatedAt: "desc" } })
    );
    expect(mockCollectionFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ orderBy: { updatedAt: "desc" } })
    );
  });
});
