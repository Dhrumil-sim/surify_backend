import { Request, Response, NextFunction } from 'express';
import { ApiError } from '@utils';
import chalk from 'chalk';
const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  next: NextFunction
) => {
  console.error(
    chalk.red(`[${new Date().toISOString()}] ${err.errorCode}: ${err.message}`)
  );
  if (err.errors.length > 0) {
    console.error(
      chalk.yellow('Details:'),
      chalk.cyan(JSON.stringify(err.errors, null, 2))
    );
    console.error(
      chalk.yellow('Data:'),
      chalk.cyan(JSON.stringify(err.data, null, 2))
    );
  }

  res.status(err.statusCode).json({
    success: err.success,
    errorCode: err.errorCode,
    message: err.message,
    errors: err.errors,
    data: err.data,
  });
};

export { errorHandler };
