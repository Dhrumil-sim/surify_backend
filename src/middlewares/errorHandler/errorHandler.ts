import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@utils';
import { StatusCodes } from 'http-status-codes';
import chalk from 'chalk';
import fs from 'fs';

const errorHandler = (
  err: Error | ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  let statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  let errorCode = 'INTERNAL_ERROR';
  let message = 'Internal server error';
  let errors: unknown[] = [];
  let data: unknown[] = [];

  // Handle ApiError instances
  if (err instanceof ApiError) {
    statusCode = err.statusCode;
    errorCode = err.errorCode;
    message = err.message;
    errors = err.errors;
    data = err.data;
  }
  // Handle multer errors
  else if (err.name === 'MulterError') {
    statusCode = StatusCodes.BAD_REQUEST;
    errorCode = 'FILE_UPLOAD_ERROR';
    message = err.message;
  }
  // Handle validation errors
  else if (err.name === 'ValidationError') {
    statusCode = StatusCodes.BAD_REQUEST;
    errorCode = 'VALIDATION_ERROR';
    message = err.message;
  }
  // Handle mongoose cast errors (invalid ObjectId)
  else if (err.name === 'CastError') {
    statusCode = StatusCodes.BAD_REQUEST;
    errorCode = 'INVALID_ID';
    message = 'Invalid ID provided';
  }
  // Handle other errors
  else {
    message = err.message || 'Internal server error';
  }

  // Log the error
  console.error(
    chalk.red(`[${new Date().toISOString()}] ${errorCode}: ${message}`)
  );

  if (errors.length > 0) {
    console.error(
      chalk.yellow('Details:'),
      chalk.cyan(JSON.stringify(errors, null, 2))
    );
    console.error(
      chalk.yellow('Data:'),
      chalk.cyan(JSON.stringify(data, null, 2))
    );
  }

  // Ensure statusCode is valid
  if (!statusCode || statusCode < 100 || statusCode > 599) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  // Delete uploaded files if present in req.cleanupFiles
  if (Array.isArray(req['cleanupFiles'])) {
    req['cleanupFiles'].forEach((filePath: string) => {
      fs.unlink(filePath, (err) => {
        if (err) {
          console.error(`Failed to delete file: ${filePath}`, err);
        }
      });
    });
  }

  res.status(statusCode).json({
    success: false,
    statusCode,
    errorCode,
    message,
    errors,
    data,
  });
};

export { errorHandler };
