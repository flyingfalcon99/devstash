import { describe, it, expect, beforeEach, vi } from "vitest";

describe("emailVerificationEnabled", () => {
  beforeEach(() => {
    vi.resetModules();
    delete process.env.REQUIRE_EMAIL_VERIFICATION;
  });

  it("is false when env var is unset", async () => {
    const { emailVerificationEnabled } = await import("@/lib/feature-flags");
    expect(emailVerificationEnabled).toBe(false);
  });

  it("is true when REQUIRE_EMAIL_VERIFICATION=true", async () => {
    process.env.REQUIRE_EMAIL_VERIFICATION = "true";
    const { emailVerificationEnabled } = await import("@/lib/feature-flags");
    expect(emailVerificationEnabled).toBe(true);
  });
});
