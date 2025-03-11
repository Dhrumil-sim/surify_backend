import { Request, Response, NextFunction } from 'express';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { User } from '../models/user.model.js';
import { upload } from '../middlewares/fileUpload/multer.middleware.js';
import { ApiResponse } from '../utils/ApiResponse.js';
const registerUser = asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { username, email, password,role} = req.body;

    if ([username,email,password,role].some((field)=>field?.trim()==="")) 
    {
        // Throwing a 400 Bad Request error with a specific error code
        throw new ApiError(400, 'ALL_IS_REQUIRED', 'All fields are required');
    }


     // it will check that user is already exists or not with either given email or username

    const existedUser = User.findOne({
        $or: [{ username },{email}]
    });

    if(await existedUser)
    {
         throw new ApiError(409,'ALREADY_EXISTED_USER',"User with given username or email is already exists");
    }
    // 

    // check for profile-pic

    // Check for profile-pic upload
    const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;
    const profilePicturePath = files?.['profile_pic']?.[0]?.path || null;


    // check for the role

    if(!(role==='user'|| role==='artist'))
    {
        throw new ApiError(409,'Invalid_Roles',"Kindly Enter Valid Roles");
    }

   const user =  User.create({
        username,
        email,
        password,
        profile_pic: profilePicturePath,
        role: role.toLowerCase(),
    });

    const createdUser = await User.findById((await user)._id).select(
        "-password -refreshToken"
    )

    if(!createdUser)
    {
         throw new ApiError(500,"Something went wrong while registration ");
    }


    return res.status(201).json(
     new ApiResponse(200,createdUser,"User registered Successfully")
    );
    


});

export { registerUser };
