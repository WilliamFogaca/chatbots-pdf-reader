export class FailedToCreateResourceError extends Error {
  constructor(resourceName: string) {
    super(`Failed to create resource: ${resourceName}`);
  }
}
