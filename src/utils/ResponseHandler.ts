import { Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import { ApiResponse } from './ApiResponse.js';
import { ApiError, ErrorDetail } from './ApiError.js';
import {
  GLOBAL_SUCCESS_MESSAGES,
  GLOBAL_DELETE_MESSAGES,
} from '../constants/global.constants.js';

interface ResponseOptions {
  statusCode?: number;
  message?: string;
  data?: unknown;
  errors?: ErrorDetail[];
  meta?: {
    page?: number;
    limit?: number;
    total?: number;
    totalPages?: number;
  };
}

class ResponseHandler {
  /**
   * Send a successful response
   */
  static success(
    res: Response,
    data: unknown = null,
    message: string = GLOBAL_SUCCESS_MESSAGES.OPERATION_SUCCESSFUL,
    statusCode: number = StatusCodes.OK,
    meta?: ResponseOptions['meta']
  ): Response {
    const responseData = meta ? { data, meta } : data;
    new ApiResponse(statusCode, responseData, message);

    return res.status(statusCode).json({
      success: true,
      statusCode,
      message,
      data: responseData,
    });
  }

  /**
   * Send a created response
   */
  static created(
    res: Response,
    data: unknown = null,
    message: string = GLOBAL_SUCCESS_MESSAGES.CREATED_SUCCESSFULLY
  ): Response {
    return this.success(res, data, message, StatusCodes.CREATED);
  }

  /**
   * Send a no content response
   */
  static noContent(res: Response): Response {
    return res.status(StatusCodes.NO_CONTENT).send();
  }

  /**
   * Send a paginated response
   */
  static paginated(
    res: Response,
    data: unknown[],
    total: number,
    page: number,
    limit: number,
    message: string = GLOBAL_SUCCESS_MESSAGES.DATA_RETRIEVED
  ): Response {
    const totalPages = Math.ceil(total / limit);
    const meta = {
      page,
      limit,
      total,
      totalPages,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1,
    };

    return this.success(res, data, message, StatusCodes.OK, meta);
  }

  /**
   * Send a delete success response
   */
  static deleted(
    res: Response,
    data: unknown = null,
    message: string = GLOBAL_DELETE_MESSAGES.SOFT_DELETED
  ): Response {
    return this.success(res, data, message, StatusCodes.OK);
  }

  /**
   * Send a login success response
   */
  static loginSuccess(
    res: Response,
    data: unknown,
    message: string = GLOBAL_SUCCESS_MESSAGES.LOGIN_SUCCESSFUL
  ): Response {
    return this.success(res, data, message, StatusCodes.OK);
  }

  /**
   * Send a logout success response
   */
  static logoutSuccess(
    res: Response,
    message: string = GLOBAL_SUCCESS_MESSAGES.LOGOUT_SUCCESSFUL
  ): Response {
    return this.success(res, null, message, StatusCodes.OK);
  }

  /**
   * Send a file upload success response
   */
  static fileUploaded(
    res: Response,
    data: unknown,
    message: string = GLOBAL_SUCCESS_MESSAGES.FILE_UPLOADED_SUCCESSFULLY
  ): Response {
    return this.success(res, data, message, StatusCodes.CREATED);
  }

  /**
   * Send an error response
   */
  static error(
    res: Response,
    error: ApiError | Error,
    statusCode?: number
  ): Response {
    if (error instanceof ApiError) {
      return res.status(error.statusCode).json({
        success: false,
        statusCode: error.statusCode,
        errorCode: error.errorCode,
        message: error.message,
        errors: error.errors,
        data: error.data,
      });
    }

    const finalStatusCode = statusCode || StatusCodes.INTERNAL_SERVER_ERROR;
    return res.status(finalStatusCode).json({
      success: false,
      statusCode: finalStatusCode,
      errorCode: 'INTERNAL_ERROR',
      message: error.message || 'Internal server error',
      errors: [],
      data: [],
    });
  }

  /**
   * Send a not found response
   */
  static notFound(
    res: Response,
    message: string = 'Resource not found',
    errorCode: string = 'NOT_FOUND'
  ): Response {
    const error = new ApiError(StatusCodes.NOT_FOUND, errorCode, message);
    return this.error(res, error);
  }

  /**
   * Send a bad request response
   */
  static badRequest(
    res: Response,
    message: string = 'Bad request',
    errorCode: string = 'BAD_REQUEST',
    errors?: ErrorDetail[]
  ): Response {
    const error = new ApiError(
      StatusCodes.BAD_REQUEST,
      errorCode,
      message,
      errors
    );
    return this.error(res, error);
  }

  /**
   * Send an unauthorized response
   */
  static unauthorized(
    res: Response,
    message: string = 'Unauthorized',
    errorCode: string = 'UNAUTHORIZED'
  ): Response {
    const error = new ApiError(StatusCodes.UNAUTHORIZED, errorCode, message);
    return this.error(res, error);
  }

  /**
   * Send a forbidden response
   */
  static forbidden(
    res: Response,
    message: string = 'Forbidden',
    errorCode: string = 'FORBIDDEN'
  ): Response {
    const error = new ApiError(StatusCodes.FORBIDDEN, errorCode, message);
    return this.error(res, error);
  }

  /**
   * Send a conflict response
   */
  static conflict(
    res: Response,
    message: string = 'Resource already exists',
    errorCode: string = 'CONFLICT'
  ): Response {
    const error = new ApiError(StatusCodes.CONFLICT, errorCode, message);
    return this.error(res, error);
  }

  /**
   * Send a validation error response
   */
  static validationError(
    res: Response,
    message: string = 'Validation failed',
    errors: ErrorDetail[] = [],
    errorCode: string = 'VALIDATION_ERROR'
  ): Response {
    const error = new ApiError(
      StatusCodes.UNPROCESSABLE_ENTITY,
      errorCode,
      message,
      errors
    );
    return this.error(res, error);
  }

  /**
   * Send an internal server error response
   */
  static internalError(
    res: Response,
    message: string = 'Internal server error',
    errorCode: string = 'INTERNAL_ERROR'
  ): Response {
    const error = new ApiError(
      StatusCodes.INTERNAL_SERVER_ERROR,
      errorCode,
      message
    );
    return this.error(res, error);
  }
}

export { ResponseHandler };
