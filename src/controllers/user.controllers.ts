import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';

// Extend Express Request to include cookies
interface AuthenticatedRequest extends Request {
    cookies: { accessToken?: string }; // Define cookies with accessToken
    user?: any;
}

const generateAccessAndRefreshTokens = async (UserId: string) => {
    try {
        // Find the user by ID
        const user = await User.findById(UserId);
 
         console.log(user);
        // Check if user exists
        if (!user) {
            throw new ApiError(404, "User not found");
        }

        // Generate access and refresh tokens
        const accessToken = user.generateAccessToken();
        const refreshToken = user.generateRefreshToken();

        console.warn("Access token",accessToken);
        console.warn("refreshToken",refreshToken);

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

const loginUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { email, username, password } = req.body;

    if (!username && !email) {
        throw new ApiError(400, "Username or Email is required");
    }

    const user = await User.findOne({ $or: [{ username }, { email }] }).select("+password");

    if (!user) {
        throw new ApiError(404, "User doesn't exist with the given username or email");
    }
    // Check password
    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        console.log("Password is not valid");
        throw new ApiError(401, "Invalid credentials");
    }

    console.log("Password valid, generating tokens...");
    
    // Generate tokens
    const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);

 
    const loggedInUser = await User.findById(user.id).select("-password -refreshToken");

    const options = { httpOnly: true, secure: true };

    return res
        .status(200)
        .cookie("accessToken", accessToken, options)
        .cookie("refreshToken", refreshToken, options)
        .json(new ApiResponse(200, { user: loggedInUser, accessToken, refreshToken }, "User Logged In Successfully"));
});

const logoutUser = asyncHandler(async(req: AuthenticatedRequest, res: Response) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $unset: {
                refreshToken: 1 // this removes the field from document
            }
        },
        {
            new: true
        }
    )

    const options = {
        httpOnly: true,
        secure: true
    }

    return res
    .status(200)
    .clearCookie("accessToken", options)
    .clearCookie("refreshToken", options)
    .json(new ApiResponse(200, {}, "User logged Out"))
})

export { registerUser, loginUser,logoutUser };

// Refresh token matching with database

const refreshAccessToken = asyncHandler(async (req: Request,res: Response)=>{

    const incomingRefreshToken = req.cookies.refreshToken || req.body.refreshToken;

    if(!incomingRefreshToken)
    {
         throw new ApiError(401,"unauthorized request");
    }
    try
    {
        const refreshTokenSecret: any = process.env.REFRESH_TOKEN_SECRET;
        const decodedToken: any = jwt.verify(incomingRefreshToken,refreshTokenSecret);

        // now based on decoded token search that user is exists or not in database 

        const user = await User.findById(decodedToken?._id);

        if(!user)
        {
             throw new ApiError(401,"User Doesn't Exists");
        }

        // Now matching the user's refresh token and token which is stored in database

        if(incomingRefreshToken !== user?.refreshToken)
        {
             throw new ApiError(401,"Invalid Refresh Token");
        }

        // now let's generate new tokens 

        const options   = {
            httpOnly : true,
            secure: true
        }

        const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user.id);
        
    
    }
    catch(error)
    {
        throw new ApiError(401,"Invalid User or Refresh Token");
    }
});