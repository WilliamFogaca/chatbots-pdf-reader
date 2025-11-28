import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "@/db/connection.ts";
import { schema } from "@/db/schema/index.ts";
import { extractPagesFromPDF } from "@/utils/extract-pages-from-pdf.ts";
import { splitTextIntoChunks } from "@/utils/split-text-into-chunks.ts";
import { FailedToCreateResourceError } from "./errors/failed-to-create-resource-error.ts";
import { FailedToExtractContentFromPdfFileError } from "./errors/failed-to-extract-content-from-pdf-file-error.ts";
import { RequiredParameterError } from "./errors/required-parameter-error.ts";
import { buildRowsToInsert } from "./helpers/build-pdf-files-rows.ts";

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

      const pdfBuffer = await pdfFile.toBuffer();
      const pagesFromPdf = await extractPagesFromPDF(pdfBuffer);
      const pageTexts = pagesFromPdf.reduce<string[]>((acc, item, index) => {
        acc.push(
          ...splitTextIntoChunks({
            text: item,
            prefix: `(page ${index + 1}) `,
          })
        );
        return acc;
      }, []);

      const rowsToInsert = await buildRowsToInsert(chatbotId, pageTexts);

      if (rowsToInsert.length === 0) {
        throw new FailedToExtractContentFromPdfFileError();
      }

      const result = await db
        .insert(schema.pdfFiles)
        .values(rowsToInsert)
        .returning({ id: schema.pdfFiles.id });

      if (result.length === 0) {
        throw new FailedToCreateResourceError("arquivo PDF");
      }

      return reply.status(201).send({
        totalChunks: result.length,
      });
    }
  );
};
