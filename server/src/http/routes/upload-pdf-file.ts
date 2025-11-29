import type { FastifyPluginCallbackZod } from "fastify-type-provider-zod";
import { z } from "zod";
import { getChatbotPDFFilesRepository } from "@/db/factories/repositories-factory.ts";
import { FailedToExtractContentFromPdfFileError } from "@/domain/errors/failed-to-extract-content-from-pdf-file-error.ts";
import { RequiredParameterError } from "@/domain/errors/required-parameter-error.ts";
import { extractPagesFromPDF } from "@/utils/extract-pages-from-pdf.ts";
import { splitTextWithLangChain } from "@/utils/split-text-with-langchain.ts";

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

      const chatbotPDFFilesRepository = getChatbotPDFFilesRepository();

      const result = await chatbotPDFFilesRepository.createWithChunks({
        chatbotId,
        fileName: pdfFile.filename,
        mimeType: pdfFile.mimetype,
        pageTexts,
      });

      return reply.status(201).send({
        totalChunks: result.length,
      });
    }
  );
};
