export class RequiredParameterError extends Error {
  constructor(resourceName: string) {
    super(`Parâmetro obrigatório ausente: ${resourceName}`);
  }
}
