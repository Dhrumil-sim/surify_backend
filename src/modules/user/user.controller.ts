import { Request, Response, NextFunction } from 'express';
import UserService from './services/userService.js';
import { ApiError, asyncHandler } from '@utils/index.js';
import JWTService from './services/jwtService.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { StatusCodes } from 'http-status-codes';
import { User } from '../../models/user.model.js';
import Jwt from 'jsonwebtoken';

interface AuthenticatedRequest extends Request {
  cookies: { accessToken?: string; refreshToken?: string }; // Define cookies with accessToken
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user?: any;
}
interface DecodedToken {
  _id: string;
  // Add other properties as present in your JWT payload
}

class AuthController {
  static registerUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { username, email, password, role } = req.body;
      const profilePicture = req.file ? req.file.path : 'dummy_path';

      try {
        const newUser = await UserService.createUser(
          username,
          email,
          password,
          role,
          profilePicture
        );
        return res.status(201).json({
          message: 'User registered successfully',
          user: {
            id: newUser._id,
            username: newUser.username,
            email: newUser.email,
            profile_picture: newUser.profile_picture,
          },
        });
      } catch (error) {
        return next(error);
      }
    }
  );

  static loginUser = asyncHandler(
    async (req: Request, res: Response, next: NextFunction) => {
      const { email, username, password } = req.body;

      if (!username && !email) {
        throw new ApiError(
          StatusCodes.BAD_REQUEST,
          'Username or Email is required'
        );
      }

      try {
        const user = await UserService.validateUserCredentials(
          username || email,
          password
        );

        const { accessToken, refreshToken } =
          await JWTService.generateAccessAndRefreshTokens(user.id);

        const loggedInUser = await User.findById(user.id).select(
          '-password -refreshToken'
        );

        const options = { httpOnly: true, secure: true };

        return res
          .status(200)
          .cookie('accessToken', accessToken, options)
          .cookie('refreshToken', refreshToken, options)
          .json(
            new ApiResponse(
              StatusCodes.OK,
              { user: loggedInUser, accessToken, refreshToken },
              'User logged in successfully'
            )
          );
      } catch (error) {
        return next(error);
      }
    }
  );

  static logoutUser = asyncHandler(
    async (req: AuthenticatedRequest, res: Response) => {
      try {
        await User.findByIdAndUpdate(
          req.user._id,
          { $unset: { refreshToken: 1 } },
          { new: true }
        );

        const options = { httpOnly: true, secure: true };

        return res
          .status(200)
          .clearCookie('accessToken', options)
          .clearCookie('refreshToken', options)
          .json(
            new ApiResponse(StatusCodes.OK, {}, 'User logged out successfully')
          );
      } catch {
        return res
          .status(500)
          .json(
            new ApiResponse(
              StatusCodes.INTERNAL_SERVER_ERROR,
              {},
              'Error logging out'
            )
          );
      }
    }
  );

  static refreshAccessToken = asyncHandler(
    async (req: Request, res: Response) => {
      const incomingRefreshToken =
        req.cookies['refreshToken'] || req.body.refreshToken;

      if (!incomingRefreshToken) {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Unauthorized request');
      }

      try {
        const refreshTokenSecret = process.env['REFRESH_TOKEN_SECRET'];
        const decodedToken = Jwt.verify(
          incomingRefreshToken,
          refreshTokenSecret
        ) as DecodedToken;

        // now based on decoded token search that user is exists or not in database

        const user = await User.findById(decodedToken?._id);

        if (!user) {
          throw new ApiError(StatusCodes.BAD_REQUEST, "User Doesn't Exists");
        }

        const { accessToken, refreshToken } =
          await JWTService.generateAccessAndRefreshTokens(user.id);

        const options = { httpOnly: true, secure: true };

        return res
          .status(200)
          .cookie('accessToken', accessToken, options)
          .cookie('refreshToken', refreshToken, options)
          .json(
            new ApiResponse(
              StatusCodes.OK,
              { accessToken, refreshToken },
              'Tokens refreshed successfully'
            )
          );
      } catch {
        throw new ApiError(StatusCodes.UNAUTHORIZED, 'Invalid Refresh Token');
      }
    }
  );
}

export default AuthController;
