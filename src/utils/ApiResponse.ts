import chalk from 'chalk';

class ApiResponse<T> {
  success: boolean;

  constructor(
    public statusCode: number,
    public data: T,
    public message: string = 'Success'
  ) {
    this.success = statusCode < 400;

    // Format the data object with 2-space indentation
    const formattedData = JSON.stringify(this.data, null, 2);

    // Determine the appropriate chalk color based on success or failure
    const log = this.success ? chalk.green : chalk.red;

    // Log the message and formatted data in the chosen color
    console.log(
      log(
        `ApiResponse: ${this.message} (Status: ${this.statusCode})\nData: ${formattedData}`
      )
    );
  }
}

export { ApiResponse };
