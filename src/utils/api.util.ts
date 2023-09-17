import { TimeoutError } from 'ky';
import type { HTTPError } from 'ky';

export const PAGINATION_TAKE = 16;

export class ApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
  ) {
    super(message);
    this.statusCode = statusCode;
  }
}

export async function generateApiError(error: HTTPError | TimeoutError) {
  if (error instanceof TimeoutError) {
    return new ApiError(error.message, 408);
  }

  const errorRes = await (error as HTTPError).response.json();
  return new ApiError(errorRes.message, errorRes.statusCode);
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
