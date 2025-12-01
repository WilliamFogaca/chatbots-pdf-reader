import { fileURLToPath } from "node:url";
import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  plugins: [react()],
  test: {
    environment: "happy-dom",
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
          include: ["**/*.test.{ts,js,tsx,jsx}"],
          exclude: [
            "node_modules/**",
            "dist/**",
            "**/*.integration.test.{ts,js,tsx,jsx}",
          ],
          name: "unit",
        },
      },
      {
        extends: true,
        test: {
          include: ["**/*.integration.test.{ts,js,tsx,jsx}"],
          exclude: ["node_modules/**", "dist/**"],
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
