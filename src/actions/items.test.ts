import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/db/items", () => ({
  updateItemById: vi.fn(),
  deleteItemById: vi.fn(),
}));

import { deleteItem, updateItem } from "./items";
import { auth } from "@/auth";
import { deleteItemById, updateItemById } from "@/lib/db/items";

const mockAuth = vi.mocked(auth);
const mockDelete = vi.mocked(deleteItemById);
const mockUpdate = vi.mocked(updateItemById);

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
