import { fileURLToPath } from "node:url";
import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    setupFiles: ["./vitest.setup.ts"],
    css: true,
    coverage: {
      provider: "v8",
      reporter: ["text", "json", "html"],
      exclude: [
        "node_modules/",
        "vitest.setup.ts",
        "**/*.config.*",
        "**/*.d.ts",
        "**/types/**",
      ],
    },
    projects: [
      {
        extends: true,
        test: {
          include: ["**/*.test.ts"],
          exclude: ["node_modules/**", "**/*.integration.test.ts"],
          name: "unit",
        },
      },
      {
        extends: true,
        test: {
          include: ["**/*.integration.test.ts"],
          exclude: ["node_modules/**"],
          name: "integration",
        },
      },
    ],
  },
  resolve: {
    alias: {
      "@": fileURLToPath(new URL("./src", import.meta.url)),
      "@test": fileURLToPath(new URL("./test", import.meta.url)),
    },
  },
});
