import { getDocument } from "pdfjs-dist/legacy/build/pdf.mjs";
import { describe, expect, it, vi } from "vitest";
import { extractPagesFromPDF } from "./extract-pages-from-pdf.ts";

vi.mock("pdfjs-dist/legacy/build/pdf.mjs", () => ({
  GlobalWorkerOptions: { workerSrc: "" },
  getDocument: vi.fn(),
}));

describe("extractPagesFromPDF", () => {
  it("should extract text from PDF pages", async () => {
    const mockPage = {
      getTextContent: vi.fn().mockResolvedValue({
        items: [{ str: "Hello" }, { str: "World" }, { str: "Page 1" }],
      }),
    };

    const mockPdfDocument = {
      numPages: 1,
      getPage: vi.fn().mockResolvedValue(mockPage),
    };

    vi.mocked(getDocument).mockReturnValue({
      promise: Promise.resolve(mockPdfDocument),
    } as any);

    const buffer = Buffer.from("fake pdf");
    const result = await extractPagesFromPDF(buffer);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe("Hello World Page 1");
  });

  it("should extract text from multiple pages", async () => {
    const mockPage1 = {
      getTextContent: vi.fn().mockResolvedValue({
        items: [{ str: "Page 1 content" }],
      }),
    };

    const mockPage2 = {
      getTextContent: vi.fn().mockResolvedValue({
        items: [{ str: "Page 2 content" }],
      }),
    };

    const mockPdfDocument = {
      numPages: 2,
      getPage: vi
        .fn()
        .mockResolvedValueOnce(mockPage1)
        .mockResolvedValueOnce(mockPage2),
    };

    vi.mocked(getDocument).mockReturnValue({
      promise: Promise.resolve(mockPdfDocument),
    } as any);

    const buffer = Buffer.from("fake pdf");
    const result = await extractPagesFromPDF(buffer);

    expect(result).toHaveLength(2);
    expect(result[0]).toBe("Page 1 content");
    expect(result[1]).toBe("Page 2 content");
  });

  it("should skip empty pages", async () => {
    const mockPage1 = {
      getTextContent: vi.fn().mockResolvedValue({
        items: [{ str: "Content" }],
      }),
    };

    const mockPage2 = {
      getTextContent: vi.fn().mockResolvedValue({
        items: [{ str: "" }],
      }),
    };

    const mockPdfDocument = {
      numPages: 2,
      getPage: vi
        .fn()
        .mockResolvedValueOnce(mockPage1)
        .mockResolvedValueOnce(mockPage2),
    };

    vi.mocked(getDocument).mockReturnValue({
      promise: Promise.resolve(mockPdfDocument),
    } as any);

    const buffer = Buffer.from("fake pdf");
    const result = await extractPagesFromPDF(buffer);

    expect(result).toHaveLength(1);
    expect(result[0]).toBe("Content");
  });

  it("should normalize whitespace", async () => {
    const mockPage = {
      getTextContent: vi.fn().mockResolvedValue({
        items: [{ str: "Text   with" }, { str: "  extra    spaces" }],
      }),
    };

    const mockPdfDocument = {
      numPages: 1,
      getPage: vi.fn().mockResolvedValue(mockPage),
    };

    vi.mocked(getDocument).mockReturnValue({
      promise: Promise.resolve(mockPdfDocument),
    } as any);

    const buffer = Buffer.from("fake pdf");
    const result = await extractPagesFromPDF(buffer);

    expect(result[0]).toBe("Text with extra spaces");
  });

  it("should return empty array for PDF with no text", async () => {
    const mockPage = {
      getTextContent: vi.fn().mockResolvedValue({
        items: [],
      }),
    };

    const mockPdfDocument = {
      numPages: 1,
      getPage: vi.fn().mockResolvedValue(mockPage),
    };

    vi.mocked(getDocument).mockReturnValue({
      promise: Promise.resolve(mockPdfDocument),
    } as any);

    const buffer = Buffer.from("fake pdf");
    const result = await extractPagesFromPDF(buffer);

    expect(result).toHaveLength(0);
  });
});
