import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError.js';

const errorHandler = (
    err: ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    // Log the error details
    console.error(`Status Code: ${statusCode}, Message: ${message}, Stack: ${err.stack}`);

    // Send the error response
    res.status(statusCode).json({
        success: false,
        message,
        errors: err.errors || [],
    });
};

export { errorHandler };
