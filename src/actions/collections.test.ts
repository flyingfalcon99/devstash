import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: { collection: { create: vi.fn() } },
}));

import { createCollection } from "./collections";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockCreate = vi.mocked(prisma.collection.create);

beforeEach(() => {
  vi.clearAllMocks();
});

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
