import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "../../db/connection.ts";
import { schema } from "../../db/schema/index.ts";
import { FailedToCreateResourceError } from "./errors/failed-to-create-resource-error.ts";
import { RequiredParameterError } from "./errors/required-parameter-error.ts";

export const uploadPDFFileRoute: FastifyPluginCallbackZod = (app) => {
  app.post(
    "/chatbots/:chatbotId/pdf-files/upload",
    {
      schema: {
        params: z.object({
          chatbotId: z.uuid(),
        }),
      },
    },
    async (request, reply) => {
      const { chatbotId } = request.params;
      const pdfFile = await request.file();

      if (!pdfFile) {
        throw new RequiredParameterError("arquivo PDF");
      }

      // const pdfBuffer = await pdfFile.toBuffer();
      // const pdfAsBase64 = pdfBuffer.toString("base64");
      // const content = await getPDFContent(
      //   pdfAsBase64,
      //   pdfFile.mimetype
      // );

      // const embeddings = await generateEmbeddings(content);

      const result = await db
        .insert(schema.pdfFiles)
        .values({
          chatbotId,
          content: "",
          embeddings: [],
        })
        .returning();

      const insertedRow = result[0];

      if (!insertedRow) {
        throw new FailedToCreateResourceError("arquivo PDF");
      }

      return reply.status(201).send({ pdfFileId: insertedRow.id });
    }
  );
};
