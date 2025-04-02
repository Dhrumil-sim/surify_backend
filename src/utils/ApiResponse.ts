import chalk from 'chalk';

class ApiResponse<T> {
  success: boolean;

  constructor(
    public statusCode: number,
    public data: T,
    public message: string = 'Success'
  ) {
    this.success = statusCode < 400;

    // Pretty-print the data object with 2-space indentation
    const formattedData = JSON.stringify(this.data, null, 2);

    // Log the success message and formatted data in green
    console.log(
      chalk.green(
        `ApiResponse: ${this.message} (Status: ${this.statusCode})\nData: ${formattedData}`
      )
    );
  }
}

export { ApiResponse };
