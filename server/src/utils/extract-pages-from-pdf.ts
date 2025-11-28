import { createRequire } from "node:module";
import {
  GlobalWorkerOptions,
  getDocument,
} from "pdfjs-dist/legacy/build/pdf.mjs";
import type { TextItem } from "pdfjs-dist/types/src/display/api.js";

const require = createRequire(import.meta.url);

GlobalWorkerOptions.workerSrc = require.resolve(
  "pdfjs-dist/legacy/build/pdf.worker.min.mjs"
);

export async function extractPagesFromPDF(buffer: Buffer): Promise<string[]> {
  const data = new Uint8Array(
    buffer.buffer.slice(
      buffer.byteOffset,
      buffer.byteOffset + buffer.byteLength
    )
  );

  const loadingTask = getDocument({
    data,
    useSystemFonts: true,
    disableFontFace: true,
  });

  const pdfDocument = await loadingTask.promise;
  const totalPages = pdfDocument.numPages;
  const pagesText: string[] = [];

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const textContent = await page.getTextContent();

    const pageText = textContent.items
      .map((item) => {
        const textItem = item as TextItem;
        return textItem.str || "";
      })
      .join(" ")
      .replace(/\s+/g, " ")
      .trim();

    if (pageText.length > 0) {
      pagesText.push(pageText);
    }
  }

  return pagesText;
}
