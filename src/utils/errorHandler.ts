import { HTTP_ERRORS } from "../constants.js";

/**
 * @module Utils
 * @description Utility functions for handling errors.
 */

/**
 * Creates an error response object using predefined HTTP error codes.
 * @function createError
 * @memberof module:Utils
 * @param errorKey - The key representing the HTTP error (e.g., "BAD_REQUEST").
 * @param {string} message - Custom error message.
 * @returns {{ code: number, type: string, message: string }} The formatted error object.
 */
const createError = (errorKey: keyof typeof HTTP_ERRORS, message: string) => {
    const error = HTTP_ERRORS[errorKey] || HTTP_ERRORS.INTERNAL_SERVER_ERROR;
    return {
        code: error.code,
        type: error.type,
        message,
    };
};

export { createError };
