import { StatusCodes, getReasonPhrase } from 'http-status-codes';

interface ErrorDetail {
  field: string;
  message: string;
}

class ApiError extends Error {
  statusCode: number;
  errorCode: string;
  success: boolean;
  errors: ErrorDetail[];
  data: unknown; // Can be used to store any type of response data (specific to your needs)

  constructor(
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR,
    errorCode: string = 'INTERNAL_ERROR',
    message: string = getReasonPhrase(statusCode),
    errors: ErrorDetail[] = [],
    data: unknown = null, // The data field can hold any value, but specifying `unknown` is safer than `any`
    stack: string = ''
  ) {
    super(message);
    this.statusCode = statusCode;
    this.errorCode = errorCode;
    this.success = false;
    this.errors = errors;
    this.data = data;

    if (stack) {
      this.stack = stack;
    } else {
      Error.captureStackTrace(this, this.constructor);
    }
  }
}

export { ApiError };
