import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ApiError } from '@utils';
import { StatusCodes } from 'http-status-codes';

export const validateRequest = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      // Mapping Joi validation errors to a consistent structure
      const errors = error.details.map((err) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      return next(
        new ApiError(
          StatusCodes.BAD_REQUEST,
          'VALIDATION_ERROR',
          'Invalid Inputs',
          errors
        )
      );
    }

    next();
  };
};
