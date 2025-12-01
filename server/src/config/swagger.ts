import type { FastifyDynamicSwaggerOptions } from "@fastify/swagger";
import type { FastifySwaggerUiOptions } from "@fastify/swagger-ui";
import type { FastifyRegisterOptions } from "fastify";
import { jsonSchemaTransform } from "fastify-type-provider-zod";

export const swaggerOptions: FastifyDynamicSwaggerOptions = {
  openapi: {
    info: {
      title: "Chatbots PDF Reader API",
      description:
        "API para gerenciar chatbots que respondem perguntas baseadas em PDFs",
      version: "1.0.0",
    },
    servers: [
      {
        url: "http://localhost:3333",
        description: "Development server",
      },
    ],
    tags: [
      { name: "chatbots", description: "Operações relacionadas a chatbots" },
      {
        name: "questions",
        description: "Operações relacionadas a perguntas",
      },
      {
        name: "pdf-files",
        description: "Operações relacionadas a arquivos PDF",
      },
    ],
  },
  transform: jsonSchemaTransform,
};

export const swaggerUiOptions: FastifyRegisterOptions<FastifySwaggerUiOptions> =
  {
    routePrefix: "/docs",
    uiConfig: {
      docExpansion: "list",
      deepLinking: true,
    },
    staticCSP: true,
  };
