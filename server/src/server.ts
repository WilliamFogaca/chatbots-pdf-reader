import { fastifyCors } from "@fastify/cors";
import fastifyMultipart from "@fastify/multipart";
import { fastify } from "fastify";
import type { ZodTypeProvider } from "fastify-type-provider-zod";
import {
  serializerCompiler,
  validatorCompiler,
} from "fastify-type-provider-zod";
import { env } from "./env.ts";

// Routes
import { createChatbotRoute } from "./http/routes/create-chatbot.ts";
import { getChatbotRoute } from "./http/routes/get-chatbot.ts";
import { getChatbotsRoute } from "./http/routes/get-chatbots.ts";
import { uploadPDFFileRoute } from "./http/routes/upload-pdf-file.ts";

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

app.listen({ port: env.PORT }).then(() => {
  console.log(`Server is running on http://localhost:${env.PORT}`);
});
