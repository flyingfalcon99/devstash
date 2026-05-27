import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/lib/prisma", () => ({
  prisma: {
    item: { findMany: vi.fn() },
    collection: { findMany: vi.fn() },
  },
}));

import { getSearchData } from "./search";
import { prisma } from "@/lib/prisma";

const mockItemFindMany = vi.mocked(prisma.item.findMany);
const mockCollectionFindMany = vi.mocked(prisma.collection.findMany);

beforeEach(() => vi.clearAllMocks());

describe("getSearchData", () => {
  it("returns correctly mapped items and collections", async () => {
    mockItemFindMany.mockResolvedValue([
      {
        id: "item-1",
        title: "React hook pattern",
        itemType: { name: "snippet", icon: "Code", color: "#3b82f6" },
      },
      {
        id: "item-2",
        title: "Deploy to Vercel",
        itemType: { name: "command", icon: "Terminal", color: "#10b981" },
      },
    ] as never);

    mockCollectionFindMany.mockResolvedValue([
      { id: "col-1", name: "DevOps", _count: { items: 5 } },
      { id: "col-2", name: "React Patterns", _count: { items: 12 } },
    ] as never);

    const result = await getSearchData("user-1");

    expect(result.items).toEqual([
      { id: "item-1", title: "React hook pattern", typeIcon: "Code", typeColor: "#3b82f6", typeName: "snippet" },
      { id: "item-2", title: "Deploy to Vercel", typeIcon: "Terminal", typeColor: "#10b981", typeName: "command" },
    ]);
    expect(result.collections).toEqual([
      { id: "col-1", name: "DevOps", itemCount: 5 },
      { id: "col-2", name: "React Patterns", itemCount: 12 },
    ]);
  });

  it("returns empty arrays when user has no data", async () => {
    mockItemFindMany.mockResolvedValue([] as never);
    mockCollectionFindMany.mockResolvedValue([] as never);

    const result = await getSearchData("user-empty");

    expect(result).toEqual({ items: [], collections: [] });
  });

  it("falls back to defaults when itemType is null", async () => {
    mockItemFindMany.mockResolvedValue([
      { id: "item-orphan", title: "Orphaned item", itemType: null },
    ] as never);
    mockCollectionFindMany.mockResolvedValue([] as never);

    const result = await getSearchData("user-1");

    expect(result.items[0]).toEqual({
      id: "item-orphan",
      title: "Orphaned item",
      typeIcon: "File",
      typeColor: "#6b7280",
      typeName: "unknown",
    });
  });

  it("scopes both queries to the provided userId", async () => {
    mockItemFindMany.mockResolvedValue([] as never);
    mockCollectionFindMany.mockResolvedValue([] as never);

    await getSearchData("user-42");

    expect(mockItemFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-42" } })
    );
    expect(mockCollectionFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-42" } })
    );
  });

  it("maps _count.items to itemCount on collections", async () => {
    mockItemFindMany.mockResolvedValue([] as never);
    mockCollectionFindMany.mockResolvedValue([
      { id: "col-1", name: "My Collection", _count: { items: 7 } },
    ] as never);

    const result = await getSearchData("user-1");

    expect(result.collections[0].itemCount).toBe(7);
  });
});
