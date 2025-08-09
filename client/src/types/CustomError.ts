export class CustomError extends Error {
  public data: unknown;

  constructor(message: string, data: unknown) {
    super(message);
    Object.setPrototypeOf(this, CustomError.prototype);
    this.name = "CustomError";
    this.data = data;
  }
}
