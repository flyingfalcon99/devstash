import { describe, it, expect, vi, beforeEach } from "vitest";

vi.mock("@/auth", () => ({ auth: vi.fn() }));
vi.mock("@/lib/prisma", () => ({
  prisma: {
    user: {
      update: vi.fn(),
    },
  },
}));

import { updateEditorPreferences } from "./editor-preferences";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";

const mockAuth = vi.mocked(auth);
const mockUpdate = vi.mocked(prisma.user.update);

const VALID_PREFS = {
  fontSize: 14,
  tabSize: 2,
  wordWrap: true,
  minimap: false,
  theme: "vs-dark" as const,
};

beforeEach(() => {
  vi.clearAllMocks();
});

describe("updateEditorPreferences", () => {
  it("returns error when not authenticated", async () => {
    mockAuth.mockResolvedValue(null as never);

    const result = await updateEditorPreferences(VALID_PREFS);

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe("Unauthorized");
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns error for invalid theme", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await updateEditorPreferences({
      ...VALID_PREFS,
      theme: "solarized" as never,
    });

    expect(result.success).toBe(false);
    if (!result.success) expect(result.error).toBe("Invalid preferences");
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns error when fontSize is out of range", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await updateEditorPreferences({ ...VALID_PREFS, fontSize: 100 });

    expect(result.success).toBe(false);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns error when fontSize is below minimum", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await updateEditorPreferences({ ...VALID_PREFS, fontSize: 4 });

    expect(result.success).toBe(false);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("returns error when tabSize is out of range", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);

    const result = await updateEditorPreferences({ ...VALID_PREFS, tabSize: 10 });

    expect(result.success).toBe(false);
    expect(mockUpdate).not.toHaveBeenCalled();
  });

  it("saves preferences and returns success", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockUpdate.mockResolvedValue({} as never);

    const result = await updateEditorPreferences(VALID_PREFS);

    expect(result.success).toBe(true);
    if (result.success) expect(result.prefs).toEqual(VALID_PREFS);
    expect(mockUpdate).toHaveBeenCalledWith({
      where: { id: "user-1" },
      data: { editorPreferences: VALID_PREFS },
    });
  });

  it("saves with all valid theme options", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockUpdate.mockResolvedValue({} as never);

    for (const theme of ["vs-dark", "monokai", "github-dark"] as const) {
      const result = await updateEditorPreferences({ ...VALID_PREFS, theme });
      expect(result.success).toBe(true);
    }
    expect(mockUpdate).toHaveBeenCalledTimes(3);
  });

  it("saves with all valid fontSize options", async () => {
    mockAuth.mockResolvedValue({ user: { id: "user-1" } } as never);
    mockUpdate.mockResolvedValue({} as never);

    for (const fontSize of [11, 12, 13, 14, 16, 18]) {
      const result = await updateEditorPreferences({ ...VALID_PREFS, fontSize });
      expect(result.success).toBe(true);
    }
    expect(mockUpdate).toHaveBeenCalledTimes(6);
  });
});
