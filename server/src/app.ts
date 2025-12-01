import { fastifyCors } from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import { fastify } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
// Routes
import { createChatbotRoute } from "./http/routes/create-chatbot.ts";
import { createChatbotQuestionRoute } from "./http/routes/create-chatbot-question.ts";
import { getChatbotRoute } from "./http/routes/get-chatbot.ts";
import { getChatbotQuestionsRoute } from "./http/routes/get-chatbot-questions.ts";
import { getChatbotsRoute } from "./http/routes/get-chatbots.ts";
import { uploadPDFFileRoute } from "./http/routes/upload-pdf-file.ts";

export function buildApp() {
  const app = fastify().withTypeProvider<ZodTypeProvider>();

  app.register(fastifyCors, {
    origin: "http://localhost:3000",
  });

  app.register(fastifyMultipart, {
    limits: {
      fileSize: 5 * 1024 * 1024, // 5 MB
    },
  });

  app.setSerializerCompiler(serializerCompiler);
  app.setValidatorCompiler(validatorCompiler);

  app.get("/health", async () => ({ status: "ok" }));

  app.register(createChatbotRoute);
  app.register(getChatbotsRoute);
  app.register(getChatbotRoute);
  app.register(uploadPDFFileRoute);
  app.register(getChatbotQuestionsRoute);
  app.register(createChatbotQuestionRoute);

  return app;
}
