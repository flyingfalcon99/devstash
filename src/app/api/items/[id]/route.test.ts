import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db/items", () => ({ getItemById: vi.fn() }));

import { GET } from "./route";
import { auth } from "@/auth";
import { getItemById } from "@/lib/db/items";

const mockAuth = vi.mocked(auth);
const mockGetItemById = vi.mocked(getItemById);

function params(id: string) {
  return Promise.resolve({ id });
}

describe("GET /api/items/[id]", () => {
  beforeEach(() => vi.clearAllMocks());

  it("returns 401 when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);

    const res = await GET(new Request("http://localhost"), { params: params("abc") });

    expect(res.status).toBe(401);
    expect((await res.json()).error).toBe("Unauthorized");
  });

  it("returns 404 when item is not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockGetItemById.mockResolvedValue(null);

    const res = await GET(new Request("http://localhost"), { params: params("missing") });

    expect(res.status).toBe(404);
  });

  it("returns item JSON when found", async () => {
    const item = { id: "item-1", title: "Hook", tags: [], collections: [] };
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockGetItemById.mockResolvedValue(item as never);

    const res = await GET(new Request("http://localhost"), { params: params("item-1") });

    expect(res.status).toBe(200);
    expect((await res.json()).id).toBe("item-1");
  });

  it("scopes the DB query to the authenticated user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-42" } } as never);
    mockGetItemById.mockResolvedValue({ id: "item-1" } as never);

    await GET(new Request("http://localhost"), { params: params("item-1") });

    expect(mockGetItemById).toHaveBeenCalledWith("item-1", "user-42");
  });
});
