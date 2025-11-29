import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { db } from "@/db/drizzle/connection.ts";
import { schema } from "@/db/drizzle/schema/index.ts";
import { extractPagesFromPDF } from "@/utils/extract-pages-from-pdf.ts";
import { splitTextWithLangChain } from "@/utils/split-text-with-langchain.ts";
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

      const pageTexts = (
        await Promise.all(
          pagesFromPdf.map((item, index) =>
            splitTextWithLangChain({
              text: item,
              prefix: `(page ${index + 1}) `,
            })
          )
        )
      ).flat();

      if (pageTexts.length === 0) {
        throw new FailedToExtractContentFromPdfFileError();
      }

      const result = await db.transaction(async (tx) => {
        const insertedPDFfile = await tx
          .insert(schema.chatbotPDFFiles)
          .values({
            chatbotId,
            fileName: pdfFile.filename,
            mimeType: pdfFile.mimetype,
          })
          .returning({ id: schema.chatbotPDFFiles.id });

        const insertedPDFfileId = insertedPDFfile[0]?.id;

        if (!insertedPDFfileId) {
          tx.rollback();
          throw new FailedToCreateResourceError("arquivo PDF");
        }

        const rowsToInsert = await buildRowsToInsert(
          insertedPDFfileId,
          pageTexts
        );

        if (rowsToInsert.length === 0) {
          tx.rollback();
          throw new FailedToExtractContentFromPdfFileError();
        }

        const insertedChunks = await tx
          .insert(schema.pdfFileChunks)
          .values(rowsToInsert)
          .returning({ id: schema.pdfFileChunks.id });

        return insertedChunks;
      });

      return reply.status(201).send({
        totalChunks: result.length,
      });
    }
  );
};
