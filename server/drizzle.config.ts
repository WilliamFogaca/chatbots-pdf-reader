import { defineConfig } from "drizzle-kit";
import { env } from "./src/env.ts";

export default defineConfig({
  dialect: "postgresql",
  casing: "snake_case",
  schema: "./src/db/drizzle/schema/**.ts",
  out: "./src/db/drizzle/migrations",
  dbCredentials: {
    url: env.DATABASE_URL,
  },
});
