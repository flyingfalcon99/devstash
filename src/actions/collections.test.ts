import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    collection: {
      create: vi.fn(),
      findFirst: vi.fn(),
      update: vi.fn(),
      delete: vi.fn(),
    },
  },
}));

import { createCollection, updateCollection, deleteCollection } from "./collections";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockCreate = vi.mocked(prisma.collection.create);
const mockFindFirst = vi.mocked(prisma.collection.findFirst);
const mockUpdate = vi.mocked(prisma.collection.update);
const mockDelete = vi.mocked(prisma.collection.delete);

beforeEach(() => {
  vi.clearAllMocks();
});

// ─── createCollection ─────────────────────────────────────────────────────────

describe("createCollection", () => {
  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);

    const result = await createCollection({ name: "My Collection" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns error when name is empty", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await createCollection({ name: "" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Name is required");
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("returns error when name exceeds 100 characters", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await createCollection({ name: "a".repeat(101) });

    expect(result.success).toBe(false);
    expect(mockCreate).not.toHaveBeenCalled();
  });

  it("creates collection with name only", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockCreate.mockResolvedValue({ id: "col-1", name: "My Collection" } as never);

    const result = await createCollection({ name: "My Collection" });

    expect(result.success).toBe(true);
    expect(result).toMatchObject({ success: true, id: "col-1" });
    expect(mockCreate).toHaveBeenCalledWith({
      data: { name: "My Collection", description: null, userId: "user-1" },
    });
  });

  it("creates collection with name and description", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockCreate.mockResolvedValue({ id: "col-2", name: "DevOps" } as never);

    const result = await createCollection({
      name: "DevOps",
      description: "Infrastructure stuff",
    });

    expect(result.success).toBe(true);
    expect(mockCreate).toHaveBeenCalledWith({
      data: { name: "DevOps", description: "Infrastructure stuff", userId: "user-1" },
    });
  });

  it("returns error when db throws", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockCreate.mockRejectedValue(new Error("DB connection failed"));

    const result = await createCollection({ name: "My Collection" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("DB connection failed");
  });
});

// ─── updateCollection ─────────────────────────────────────────────────────────

describe("updateCollection", () => {
  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);

    const result = await updateCollection("col-1", { name: "New Name" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  it("returns error when name is empty", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await updateCollection("col-1", { name: "" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Name is required");
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  it("returns error when name exceeds 100 characters", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await updateCollection("col-1", { name: "a".repeat(101) });

    expect(result.success).toBe(false);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns error when collection not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindFirst.mockResolvedValue(null);

    const result = await updateCollection("col-missing", { name: "New Name" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("Collection not found");
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("updates name and description successfully", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindFirst.mockResolvedValue({ id: "col-1" } as never);
    mockUpdate.mockResolvedValue({} as never);

    const result = await updateCollection("col-1", {
      name: "Updated Name",
      description: "New description",
    });

    expect(result.success).toBe(true);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "col-1" },
      data: { name: "Updated Name", description: "New description" },
    });
  });

  it("scopes ownership check to authenticated user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-42" } } as never);
    mockFindFirst.mockResolvedValue({ id: "col-1" } as never);
    mockUpdate.mockResolvedValue({} as never);

    await updateCollection("col-1", { name: "Name" });

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: "col-1", userId: "user-42" },
    });
  });

  it("returns error when db throws", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindFirst.mockResolvedValue({ id: "col-1" } as never);
    mockUpdate.mockRejectedValue(new Error("DB error"));

    const result = await updateCollection("col-1", { name: "Name" });

    expect(result.success).toBe(false);
    expect(result.error).toBe("DB error");
  });
});

// ─── deleteCollection ─────────────────────────────────────────────────────────

describe("deleteCollection", () => {
  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);

    const result = await deleteCollection("col-1");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Not authenticated");
    expect(mockFindFirst).not.toHaveBeenCalled();
  });

  it("returns error when collection not found", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindFirst.mockResolvedValue(null);

    const result = await deleteCollection("col-missing");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Collection not found");
    expect(mockDelete).not.toHaveBeenCalled();
  });

  it("deletes collection successfully", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindFirst.mockResolvedValue({ id: "col-1" } as never);
    mockDelete.mockResolvedValue({} as never);

    const result = await deleteCollection("col-1");

    expect(result.success).toBe(true);
    expect(mockDelete).toHaveBeenCalledWith({ where: { id: "col-1" } });
  });

  it("scopes ownership check to authenticated user", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-99" } } as never);
    mockFindFirst.mockResolvedValue({ id: "col-1" } as never);
    mockDelete.mockResolvedValue({} as never);

    await deleteCollection("col-1");

    expect(mockFindFirst).toHaveBeenCalledWith({
      where: { id: "col-1", userId: "user-99" },
    });
  });

  it("returns error when db throws", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockFindFirst.mockResolvedValue({ id: "col-1" } as never);
    mockDelete.mockRejectedValue(new Error("Constraint violation"));

    const result = await deleteCollection("col-1");

    expect(result.success).toBe(false);
    expect(result.error).toBe("Constraint violation");
  });
});
