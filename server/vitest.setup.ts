import { beforeAll, vi } from "vitest";

beforeAll(() => {
  process.env.PORT = "3333";
  process.env.DATABASE_URL = "postgresql://test:test@localhost:5432/test";
  process.env.EMBEDDINGS_MODEL = "test-embeddings-model";
  process.env.TRANSLATION_MODEL = "test-translation-model";
  process.env.ANSWER_QUESTION_MODEL = "test-answer-model";
});

vi.mock("@/env.ts", () => ({
  env: {
    PORT: 3333,
    DATABASE_URL: "postgresql://test:test@localhost:5432/test",
    EMBEDDINGS_MODEL: "test-embeddings-model",
    TRANSLATION_MODEL: "test-translation-model",
    ANSWER_QUESTION_MODEL: "test-answer-model",
  },
}));
