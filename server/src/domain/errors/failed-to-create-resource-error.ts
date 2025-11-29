export class FailedToCreateResourceError extends Error {
  constructor(resourceName: string) {
    super(`Falha ao criar recurso: ${resourceName}`);
  }
}
