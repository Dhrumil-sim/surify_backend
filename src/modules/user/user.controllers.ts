import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../../utils/ApiError.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { User } from '../../models/user.model.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import jwt from 'jsonwebtoken';
import { StatusCodes } from "http-status-codes";
import { registerUserSchema, loginUserSchema } from './utils/auth.validator.js';
import { validateRequest } from '../../middlewares/validateRequest/validateRequest.js';
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
            throw new ApiError(StatusCodes.NOT_FOUND, "User not found");
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


const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // Validate request body using the middleware
  

    const { username, email, password, role } = req.body;

    // Check if the user already exists
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        // Ensure you're not sending a response here if it's already handled by another part of the flow
        return next(new ApiError(409, 'USER_ALREADY_EXISTS', 'User with the given username or email already exists'));
    }

    // Create new user
    const newUser = await User.create({
        username,
        email,
        password,
        role,
        profile_picture: req.file ? req.file.path : "dummy_path" // Use default path if no profile pic
    });

    // Ensure you are not sending multiple responses
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
        throw new ApiError(StatusCodes.BAD_REQUEST,""+StatusCodes.BAD_REQUEST, "Username or Email is required");
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

export const refreshAccessToken = asyncHandler(async (req: Request,res: Response)=>{

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
             throw new ApiError(StatusCodes.BAD_REQUEST,"User Doesn't Exists");
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

        return res
        .status(200)
        .cookie("accessToken",accessToken)
        .cookie("refreshToken",refreshToken)
        .json(
            new ApiResponse(
                200,
                {accessToken,refreshAccessToken}
            ),
        );
    }

    catch(error)
    {
        throw new ApiError(401,"Invalid User or Refresh Token");
    }
});
