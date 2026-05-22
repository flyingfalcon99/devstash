import { defineConfig } from "vitest/config";

export default defineConfig({
  resolve: { tsconfigPaths: true },
  test: {
    environment: "node",
    // Only .ts files — no .tsx to keep component tests out of scope
    include: ["src/**/*.test.ts"],
    exclude: ["node_modules", ".next"],
  },
});
