import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    fileParallelism: false,
    hookTimeout: 120_000,
    testTimeout: 20_000,
    setupFiles: ["./test/setup/env.js"],
    coverage: {
      provider: "v8",
      reporter: ["text", "html"],
      include: ["src/**/*.js"],
      exclude: ["src/index.js"],
      thresholds: {
        statements: 85,
        branches: 70,
        functions: 85,
        lines: 85,
      },
    },
  },
});
