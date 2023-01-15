export class FetchError extends Error {
  status: number;
  info: { message: string };

  constructor(message?: string) {
    super(message);
    this.name = 'FetchError';
  }
}
