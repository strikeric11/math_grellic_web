export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export function generateError(
  errorCodeMessage: { [key: string]: string },
  statusCode?: number,
  isExact?: boolean,
) {
  if (!statusCode) {
    return null;
  }

  if (!isExact) {
    const code = parseInt(statusCode.toString()[0]);
    return new Error(errorCodeMessage[code]);
  }

  return new Error(errorCodeMessage[statusCode]);
}
