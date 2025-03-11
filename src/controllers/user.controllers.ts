import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';

const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    // 🛠 Debugging logs
    console.log("Received Body:", req.body);
    console.log("Received Files:", req.files);

    const { username, email, password, role } = req.body;

    // ✅ Ensure req.body fields exist
    // if (!username || !email || !password || !role) {
    //     throw new ApiError(400, 'ALL_IS_REQUIRED', 'All fields are required');
    // }   

    // ✅ Fix TypeScript issue: Assert `req.files`
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const profilePicturePath = files?.['profile_pic']?.[0]?.path || null;

    // ✅ Check if user already exists
    const existedUser = await User.findOne({ $or: [{ username }, { email }] });

    if (existedUser) {
        throw new ApiError(409, 'ALREADY_EXISTED_USER', "User with given username or email already exists");
    }

    // ✅ Create new user with profile picture
    const newUser = await User.create({
        username,
        email,
        password, // Hash password before saving
        role,
        profile_picture: profilePicturePath
    });

    res.status(201).json({
        message: "User registered successfully",
        user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profile_picture: newUser.profile_picture
        }
    });
});

export { registerUser };
