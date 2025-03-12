import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';


const generateAccessAndRefreshTokens = async (UserId: string) => {
    try {
        // Find the user by ID
        const user = await User.findById(UserId);

        // Check if user exists
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        // Assign the refreshToken to the user instance
        user.refreshToken = refreshToken;

        // Save the updated user document with the new refreshToken
        await user.save({ validateBeforeSave: false});

        // Optionally return the tokens
        return { accessToken, refreshToken };
        
    } catch (error) {
        console.error(error);
        throw new ApiError(500, "Something went wrong while generating tokens");
    }
};


// Regular expression for validating password strength
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    

    const { username, email, password, role } = req.body;

    // ✅ Ensure all fields are provided
    if (!username || !email || !password || !role) {
        throw new ApiError(400, 'ALL_IS_REQUIRED', 'All fields (username, email, password, role) are required');
    }

    // ✅ Validate username
    if (username.length < 3 || username.length > 30) {
        throw new ApiError(400, 'INVALID_USERNAME', 'Username must be between 3 and 30 characters');
    }

    if (!/^[a-zA-Z0-9_]+$/.test(username)) {
        throw new ApiError(400, 'INVALID_USERNAME', 'Username can only contain alphanumeric characters and underscores');
    }

    // ✅ Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        throw new ApiError(400, 'INVALID_EMAIL', 'Please provide a valid email address');
    }

    // ✅ Validate password strength
    if (!passwordRegex.test(password)) {
        throw new ApiError(400, 'INVALID_PASSWORD', 'Password must be at least 8 characters, include one uppercase letter, one number, and one special character');
    }

    // ✅ Validate role
    const validRoles = ['admin', 'user']; // List all valid roles here
    if (!validRoles.includes(role)) {
        throw new ApiError(400, 'INVALID_ROLE', 'Invalid role. Allowed roles are admin and user');
    }

    // ✅ Validate profile picture (if exists)
    const profilePicturePath = req.file ? req.file.path : null;

    if (profilePicturePath) {
        // Ensure the file is an image
        const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/gif'];
        if (!allowedMimeTypes.includes(req.file!.mimetype)) {
            throw new ApiError(400, 'INVALID_FILE_TYPE', 'Profile picture must be an image (JPEG, PNG, GIF)');
        }

        // Check file size limit (5MB)
        const maxSize = 5 * 1024 * 1024; // 5MB
        if (req.file!.size > maxSize) {
            throw new ApiError(400, 'FILE_TOO_LARGE', 'Profile picture size should not exceed 5MB');
        }
    }

    // ✅ Check if the user already exists in the database (by username or email)
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        throw new ApiError(409, 'USER_ALREADY_EXISTS', 'User with the given username or email already exists');
    }

    // ✅ Create new user (save hashed password)
    const newUser = await User.create({
        username,
        email,
        password, // Ensure to hash password before saving
        role,
        profile_picture: profilePicturePath || "dummy_path" // Use default path if no profile pic
    });

    return res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profile_picture: newUser.profile_picture
        }
    });
});

const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction)=>{

    const {email,username,password} = req.body;

    if(!username || !email)
    {
         throw new ApiError(400,"Username or Email is required");
    }

    const user = await User.findOne({
        $or: [{username},{email}],
    }
    );

    if(!user)
    {
        throw new ApiError(404,"User doesn't exists with given username or email");
    }
});

export { registerUser };
