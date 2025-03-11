import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password, joining_date, role } = req.body;

    if (
        [username,email,password,role].some((field)=>{

            field?.trim()===""
        }) ) {
        // Throwing a 400 Bad Request error with a specific error code
        throw new ApiError(400, 'ALL_IS_REQUIRED', 'All fields are required');
    }

    // Additional user registration logic here

    res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: { username, email, role },
    });
});

export { registerUser };
