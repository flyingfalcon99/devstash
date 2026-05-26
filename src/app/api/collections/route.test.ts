import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { collection: { findMany: vi.fn() } },
}));

import { GET } from "./route";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockFindMany = vi.mocked(prisma.collection.findMany);

beforeEach(() => vi.clearAllMocks());

describe("GET /api/collections", () => {
  it("returns empty array with 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);

    const res = await GET();

    expect(res.status).toBe(401);
    expect(await res.json()).toEqual([]);
  });

  it("returns collections for authenticated user", async () => {
    const collections = [
      { id: "col-1", name: "React Patterns" },
      { id: "col-2", name: "DevOps" },
    ];
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindMany.mockResolvedValue(collections as never);

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual(collections);
  });

  it("scopes the query to the authenticated user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-42" } } as never);
    mockFindMany.mockResolvedValue([] as never);

    await GET();

    expect(mockFindMany).toHaveBeenCalledWith(
      expect.objectContaining({ where: { userId: "user-42" } })
    );
  });

  it("returns empty array when user has no collections", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindMany.mockResolvedValue([] as never);

    const res = await GET();

    expect(res.status).toBe(200);
    expect(await res.json()).toEqual([]);
  });
});
