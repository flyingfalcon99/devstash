import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db/items", () => ({
  updateItemById: vi.fn(),
  deleteItemById: vi.fn(),
  createItemInDb: vi.fn(),
}));

import { deleteItem, updateItem, createItem } from "./items";
import { auth } from "@/auth";
import { deleteItemById, updateItemById, createItemInDb } from "@/lib/db/items";

const mockAuth = vi.mocked(auth);
const mockDelete = vi.mocked(deleteItemById);
const mockUpdate = vi.mocked(updateItemById);
const mockCreate = vi.mocked(createItemInDb);

beforeEach(() => vi.clearAllMocks());

// ─── deleteItem ───────────────────────────────────────────────────────────────

describe("deleteItem", () => {
  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);

    const result = await deleteItem("item-1");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Unauthorized");
  });

  it("returns error when item not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockDelete.mockResolvedValue(null);

    const result = await deleteItem("missing");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Item not found");
  });

  it("returns success when item is deleted", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockDelete.mockResolvedValue({ id: "item-1" } as never);

    const result = await deleteItem("item-1");

    expect(result.success).toBe(true);
  });

  it("scopes the delete to the authenticated user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-42" } } as never);
    mockDelete.mockResolvedValue({ id: "item-1" } as never);

    await deleteItem("item-1");

    expect(mockDelete).toHaveBeenCalledWith("item-1", "user-42");
  });
});

// ─── updateItem ───────────────────────────────────────────────────────────────

const validPayload = {
  title: "Test",
  description: null,
  content: null,
  url: null,
  language: null,
  tags: [],
};

describe("updateItem", () => {
  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);

    const result = await updateItem("item-1", validPayload);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Unauthorized");
  });

  it("returns validation error when title is empty", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await updateItem("item-1", { ...validPayload, title: "  " });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Title is required");
  });

  it("returns validation error for invalid URL", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await updateItem("item-1", { ...validPayload, url: "not-a-url" });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/valid URL/i);
  });

  it("returns success with updated item", async () => {
    const updatedItem = { id: "item-1", title: "Test", tags: [], collections: [] };
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockUpdate.mockResolvedValue(updatedItem as never);

    const result = await updateItem("item-1", validPayload);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.id).toBe("item-1");
  });

  it("scopes the update to the authenticated user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-99" } } as never);
    mockUpdate.mockResolvedValue({ id: "item-1" } as never);

    await updateItem("item-1", validPayload);

    expect(mockUpdate).toHaveBeenCalledWith("item-1", "user-99", expect.any(Object));
  });
});

// ─── createItem ───────────────────────────────────────────────────────────────

const baseCreate = {
  type: "snippet" as const,
  title: "My Snippet",
  description: null,
  content: null,
  url: null,
  language: null,
  tags: [],
};

describe("createItem", () => {
  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);

    const result = await createItem(baseCreate);

    expect(result.success).toBe(false);
    expect(result.error).toBe("Unauthorized");
  });

  it("returns validation error when title is empty", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await createItem({ ...baseCreate, title: "  " });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Title is required");
  });

  it("requires URL when type is link", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await createItem({ ...baseCreate, type: "link", url: null });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/URL is required/i);
  });

  it("rejects an invalid URL for link type", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await createItem({ ...baseCreate, type: "link", url: "not-a-url" });

    expect(result.success).toBe(false);
    expect(result.error).toMatch(/valid URL/i);
  });

  it("allows non-link types without a URL", async () => {
    const item = { id: "item-1", title: "My Snippet", tags: [], collections: [] };
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockCreate.mockResolvedValue(item as never);

    const result = await createItem({ ...baseCreate, type: "note", url: null });

    expect(result.success).toBe(true);
  });

  it("returns created item on success", async () => {
    const item = { id: "new-1", title: "My Snippet", tags: [], collections: [] };
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockCreate.mockResolvedValue(item as never);

    const result = await createItem(baseCreate);

    expect(result.success).toBe(true);
    if (result.success) expect(result.data.id).toBe("new-1");
  });

  it("scopes the create to the authenticated user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-77" } } as never);
    mockCreate.mockResolvedValue({ id: "new-1" } as never);

    await createItem(baseCreate);

    expect(mockCreate).toHaveBeenCalledWith("user-77", expect.any(Object));
  });
});
