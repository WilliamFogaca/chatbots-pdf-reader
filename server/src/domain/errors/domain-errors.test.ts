import { describe, expect, it } from "vitest";
import { FailedToCreateResourceError } from "./failed-to-create-resource-error.ts";
import { FailedToExtractContentFromPdfFileError } from "./failed-to-extract-content-from-pdf-file-error.ts";
import { RequiredParameterError } from "./required-parameter-error.ts";

describe("Domain Errors", () => {
  describe("FailedToCreateResourceError", () => {
    it("should create error with resource name in message", () => {
      const error = new FailedToCreateResourceError("Chatbot");

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Falha ao criar recurso: Chatbot");
    });

    it("should be throwable", () => {
      expect(() => {
        throw new FailedToCreateResourceError("PDF File");
      }).toThrow("Falha ao criar recurso: PDF File");
    });
  });

  describe("FailedToExtractContentFromPdfFileError", () => {
    it("should create error with default message", () => {
      const error = new FailedToExtractContentFromPdfFileError();

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Falha ao extrair conteúdo do arquivo PDF.");
    });

    it("should be throwable", () => {
      expect(() => {
        throw new FailedToExtractContentFromPdfFileError();
      }).toThrow("Falha ao extrair conteúdo do arquivo PDF.");
    });
  });

  describe("RequiredParameterError", () => {
    it("should create error with parameter name in message", () => {
      const error = new RequiredParameterError("userId");

      expect(error).toBeInstanceOf(Error);
      expect(error.message).toBe("Parâmetro obrigatório ausente: userId");
    });

    it("should be throwable", () => {
      expect(() => {
        throw new RequiredParameterError("chatbotId");
      }).toThrow("Parâmetro obrigatório ausente: chatbotId");
    });
  });
});
