class ApiResponse<T> {
    success: boolean;

    constructor(
        public statusCode: number,
        public data: T,
        public message: string = "Success"
    ) {
        this.success = statusCode < 400;
    }
}

export { ApiResponse };
