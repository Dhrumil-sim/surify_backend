class ApiError extends Error {
    statusCode: number;
    data: any;
    success: boolean;
    errors: any[];
    errorCode: string;

    constructor(
        statusCode: number,
        errorCode: string,
        message = "Something went wrong",
        errors: any[] = [],
        stack = ""
    ) {
        super(message);
        this.statusCode = statusCode;
        this.errorCode = errorCode;
        this.data = null;
        this.success = false;
        this.errors = errors;

        if (stack) {
            this.stack = stack;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }
    }
}

export { ApiError };
