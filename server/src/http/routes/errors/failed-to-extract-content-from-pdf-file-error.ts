export class FailedToExtractContentFromPdfFileError extends Error {
  constructor() {
    super("Falha ao extrair conteúdo do arquivo PDF.");
  }
}
