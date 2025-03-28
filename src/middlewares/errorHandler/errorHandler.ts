import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError.js';

const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error(
    `[${new Date().toISOString()}] ${err.errorCode}: ${err.message}`
  );
  if (err.errors.length > 0) {
    console.error('Details:', JSON.stringify(err.errors, null, 2));
  }

  res.status(err.statusCode).json({
    success: err.success,
    errorCode: err.errorCode,
    message: err.message,
    errors: err.errors,
  });
};

export { errorHandler };
